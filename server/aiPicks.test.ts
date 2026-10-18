import type Anthropic from '@anthropic-ai/sdk'

import { runAiPicks } from './aiPicks.ts'
import { AssistantRequestError } from './errors.ts'

const body = {
  health: {
    cancerType: 'breast',
    treatments: ['surgery'],
    conditions: ['lymphoedema'],
    weeksSinceSurgery: 3,
  },
  candidates: [
    { id: 'lymphoedema-signs', kind: 'learn', title: 'Lymphoedema', summary: 'Signs' },
    { id: 'why-movement-helps', kind: 'learn', title: 'Movement', summary: 'Why' },
    { id: 'post-surgery-bra', kind: 'shop', title: 'Post-surgery bra', summary: 'Support' },
  ],
}

function fakeClient(result: unknown) {
  const parse = vi.fn().mockResolvedValue(result)
  return { client: { beta: { messages: { parse } } } as unknown as Pick<Anthropic, 'beta'>, parse }
}

describe('runAiPicks', () => {
  it('asks the fixed model with a structured format and keeps only valid candidate picks', async () => {
    const { client, parse } = fakeClient({
      stop_reason: 'end_turn',
      parsed_output: {
        learn: [
          { id: 'lymphoedema-signs', reason: '  Know what to watch for in your arm.  ' },
          { id: 'made-up-guide', reason: 'Invented' },
          { id: 'lymphoedema-signs', reason: 'Duplicate' },
        ],
        shop: [
          { id: 'post-surgery-bra', reason: 'Gentle support while you heal.' },
          { id: 'lymphoedema-signs', reason: 'Wrong kind' },
        ],
      },
    })

    const picks = await runAiPicks(body, client)

    expect(picks).toEqual({
      learn: [{ id: 'lymphoedema-signs', reason: 'Know what to watch for in your arm.' }],
      shop: [{ id: 'post-surgery-bra', reason: 'Gentle support while you heal.' }],
    })
    const params = parse.mock.calls[0]![0]
    expect(params).toMatchObject({
      model: 'claude-opus-5-5',
      fallbacks: 'default',
      output_config: { effort: 'low' },
    })
    expect(params.output_config.format).toBeDefined()
    expect(params.messages[0].content).not.toContain('name')
  })

  it('rejects bad input and refusals', async () => {
    const { client } = fakeClient({ stop_reason: 'refusal', parsed_output: null })
    await expect(runAiPicks({ health: {}, candidates: [] }, client)).rejects.toBeInstanceOf(
      AssistantRequestError,
    )
    await expect(runAiPicks(body, client)).rejects.toMatchObject({ status: 502 })
  })
})
