import { guides } from '@/features/learn'
import { cancerLabel, personalise, weeksSince, type HealthProfile } from '@/features/profile'
import { essentials, foods } from '@/features/shop'

export type PickKind = 'learn' | 'shop'

export interface Candidate {
  id: string
  kind: PickKind
  title: string
  summary: string
  forYou: boolean
}

export interface Pick {
  id: string
  reason: string
}

export type Picks = Record<PickKind, Pick[]>

/** Content suitable for this person (never items meant for other cancers). */
export function buildCandidates(health: HealthProfile): Candidate[] {
  const learn = personalise(guides, health).items.map((g) => ({
    id: g.slug,
    kind: 'learn' as const,
    title: g.title,
    summary: g.summary,
    forYou: g.forYou,
  }))
  const shop = personalise([...essentials, ...foods], health).items.map((i) => ({
    id: i.id,
    kind: 'shop' as const,
    title: i.name,
    summary: i.why,
    forYou: i.forYou,
  }))
  return [...learn, ...shop]
}

/** What the AI is told about the person: no name, no records. */
export const aiProfile = (health: HealthProfile) => ({
  cancerType: health.cancerType,
  treatments: health.treatments,
  conditions: health.conditions,
  weeksSinceSurgery: weeksSince(health.surgeryDate),
})

/** Picks without AI: the top matches for the profile. */
export function rulePicks(health: HealthProfile, candidates: Candidate[]): Picks {
  const label = cancerLabel(health.cancerType)
  const reason = (c: Candidate) =>
    c.forYou
      ? label
        ? `Chosen for your ${label.toLowerCase()} cancer recovery.`
        : 'Chosen for what you told us about your recovery.'
      : 'Helpful for most people after treatment.'
  const top = (kind: PickKind) =>
    candidates
      .filter((c) => c.kind === kind)
      .slice(0, 3)
      .map((c) => ({ id: c.id, reason: reason(c) }))
  return { learn: top('learn'), shop: top('shop') }
}
