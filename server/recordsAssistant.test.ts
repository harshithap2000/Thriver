import type Anthropic from '@anthropic-ai/sdk'

import {
  AssistantRequestError,
  MODEL,
  READ_RECORD_TOOL,
  runAssistantTurn,
} from './recordsAssistant.ts'

const record = {
  id: 'r1',
  title: 'Blood test',
  category: 'lab',
  date: '2026-10-01',
  provider: 'City Lab',
  notes: '',
  fileName: 'blood.pdf',
  mimeType: 'application/pdf',
}

function fakeClient() {
  const create = vi.fn().mockResolvedValue({
    content: [{ type: 'text', text: 'Hello' }],
    stop_reason: 'end_turn',
    model: MODEL,
  })
  return {
    client: { beta: { messages: { create } } } as unknown as Pick<Anthropic, 'beta'>,
    create,
  }
}

describe('runAssistantTurn', () => {
  it('fixes model, tools and instructions, and lists the records', async () => {
    const { client, create } = fakeClient()
    const result = await runAssistantTurn(
      { messages: [{ role: 'user', content: 'Hi' }], catalog: [record] },
      client,
      '2026-10-16',
    )

    expect(result).toEqual({
      content: [{ type: 'text', text: 'Hello' }],
      stop_reason: 'end_turn',
      model: MODEL,
    })
    const params = create.mock.calls[0]![0]
    expect(params).toMatchObject({
      model: 'claude-opus-5-5',
      fallbacks: 'default',
      betas: ['server-side-fallback-2026-07-01'],
      tools: [READ_RECORD_TOOL],
    })
    expect(params.system[1].text).toContain("Today's date: 2026-10-16")
    expect(params.system[1].text).toContain('"id":"r1"')
  })

  it('adds the name-free profile and the reply language when given', async () => {
    const { client, create } = fakeClient()
    await runAssistantTurn(
      {
        messages: [{ role: 'user', content: 'नमस्ते' }],
        catalog: [],
        context: {
          language: 'hi',
          profile: {
            cancerType: 'Breast',
            treatments: ['surgery'],
            conditions: [],
            daysSinceSurgery: 23,
            phase: '2 · Return to activity',
          },
        },
      },
      client,
    )
    const extra = create.mock.calls[0]![0].system[2].text
    expect(extra).toContain('"daysSinceSurgery":23')
    expect(extra).toContain('Hindi')

    await runAssistantTurn({ messages: [{ role: 'user', content: 'Hi' }], catalog: [] }, client)
    expect(create.mock.calls[1]![0].system).toHaveLength(2)
  })

  it('rejects malformed requests without calling the API', async () => {
    const { client, create } = fakeClient()
    await expect(runAssistantTurn({ messages: [], catalog: [] }, client)).rejects.toBeInstanceOf(
      AssistantRequestError,
    )
    await expect(
      runAssistantTurn({ messages: [{ role: 'system', content: 'x' }], catalog: [] }, client),
    ).rejects.toBeInstanceOf(AssistantRequestError)
    expect(create).not.toHaveBeenCalled()
  })
})
