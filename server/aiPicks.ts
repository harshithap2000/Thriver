import type Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'

import { AssistantRequestError } from './errors.ts'
import { MODEL } from './recordsAssistant.ts'

/**
 * Picks the most useful Learn guides and Shop items for a person, chosen ONLY from Thriver's
 * vetted catalogue (sent by the app as candidates). The model writes a short reason for each
 * pick; it cannot add products or medical content.
 */

const INSTRUCTIONS = `You personalise Thriver, a wellness app for people recovering after cancer treatment in India.

From the candidate list, choose up to 3 guides (kind "learn") and up to 3 shop items (kind "shop") that would help this person most right now. Consider their cancer type, treatments, the conditions they mentioned and how many weeks it has been since surgery (earlier weeks: healing and gentle basics; later: rebuilding strength and everyday life).

Rules:
- Use only ids from the candidate list. Never invent items.
- For each pick, write one warm sentence (under 20 words) speaking to the person as "you", explaining why it may help.
- No diagnosis, no promises about outcomes, no brand names, no medical instructions.
- If fewer items fit, return fewer.`

const requestSchema = z.object({
  health: z.object({
    cancerType: z.string().max(40).nullable(),
    treatments: z.array(z.string().max(40)).max(10),
    conditions: z.array(z.string().max(40)).max(10),
    weeksSinceSurgery: z.number().int().min(0).max(5200).nullable(),
  }),
  candidates: z
    .array(
      z.object({
        id: z.string().max(80),
        kind: z.enum(['learn', 'shop']),
        title: z.string().max(120),
        summary: z.string().max(300),
      }),
    )
    .min(1)
    .max(80),
})

const pickSchema = z.object({ id: z.string(), reason: z.string() })
const PicksSchema = z.object({ learn: z.array(pickSchema), shop: z.array(pickSchema) })

export type AiPicks = z.infer<typeof PicksSchema>

/** Keep only valid, unique candidate ids of the right kind; at most 3 each; trim reasons. */
function sanitise(
  picks: AiPicks,
  candidates: z.infer<typeof requestSchema>['candidates'],
): AiPicks {
  const clean = (list: AiPicks['learn'], kind: 'learn' | 'shop') => {
    const allowed = new Set(candidates.filter((c) => c.kind === kind).map((c) => c.id))
    const seen = new Set<string>()
    return list
      .filter((p) => allowed.has(p.id) && !seen.has(p.id) && seen.add(p.id))
      .slice(0, 3)
      .map((p) => ({ id: p.id, reason: p.reason.trim().slice(0, 160) }))
  }
  return { learn: clean(picks.learn, 'learn'), shop: clean(picks.shop, 'shop') }
}

export async function runAiPicks(body: unknown, client: Pick<Anthropic, 'beta'>): Promise<AiPicks> {
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) throw new AssistantRequestError(400, 'Invalid request')
  const { health, candidates } = parsed.data

  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: betaZodOutputFormat(PicksSchema) },
    system: INSTRUCTIONS,
    messages: [{ role: 'user', content: JSON.stringify({ person: health, candidates }) }],
  })

  if (response.stop_reason === 'refusal' || !response.parsed_output) {
    throw new AssistantRequestError(502, 'Could not personalise right now')
  }
  return sanitise(response.parsed_output, candidates)
}
