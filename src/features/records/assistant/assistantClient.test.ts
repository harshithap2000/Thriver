import type { HealthRecord } from '../useRecordsStore'
import { askAssistant, AssistantError } from './assistantClient'

const record: HealthRecord = {
  id: 'r1',
  title: 'Lipid panel',
  category: 'lab',
  date: '2026-09-30',
  provider: 'City Lab',
  notes: '',
  fileName: 'lipids.pdf',
  mimeType: 'application/pdf',
  size: 3,
  addedAt: '2026-10-01T00:00:00.000Z',
}

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('askAssistant', () => {
  it('runs read_record locally, sends the document back, and returns the answer', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        reply({
          stop_reason: 'tool_use',
          content: [
            { type: 'thinking', thinking: '', signature: 'sig' },
            { type: 'tool_use', id: 'tu1', name: 'read_record', input: { record_id: 'r1' } },
          ],
        }),
      )
      .mockResolvedValueOnce(
        reply({
          stop_reason: 'end_turn',
          content: [{ type: 'text', text: 'Your LDL was 3.1 mmol/L.' }],
        }),
      )
    const loadFile = vi.fn().mockResolvedValue(new Blob(['%PDF'], { type: 'application/pdf' }))

    const result = await askAssistant({
      history: [],
      question: 'What was my LDL?',
      records: [record],
      loadFile,
      fetchImpl,
    })

    expect(result).toMatchObject({
      reply: 'Your LDL was 3.1 mmol/L.',
      opened: ['Lipid panel'],
      refused: false,
    })
    expect(loadFile).toHaveBeenCalledWith('r1')

    const second = JSON.parse(fetchImpl.mock.calls[1]![1].body as string)
    expect(second.catalog[0]).toMatchObject({ id: 'r1', title: 'Lipid panel' })
    // Assistant turn echoed unchanged (thinking block kept), then one user message of results.
    expect(second.messages[1].content[0]).toEqual({
      type: 'thinking',
      thinking: '',
      signature: 'sig',
    })
    const toolResult = second.messages[2].content[0]
    expect(toolResult).toMatchObject({ type: 'tool_result', tool_use_id: 'tu1' })
    expect(toolResult.content[1]).toMatchObject({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: btoa('%PDF') },
    })
    expect(result.history).toHaveLength(4)
  })

  it('returns an error result for unknown records instead of failing', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        reply({
          stop_reason: 'tool_use',
          content: [
            { type: 'tool_use', id: 'tu1', name: 'read_record', input: { record_id: 'nope' } },
          ],
        }),
      )
      .mockResolvedValueOnce(
        reply({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'Not found.' }] }),
      )

    await askAssistant({
      history: [],
      question: 'x',
      records: [record],
      loadFile: vi.fn(),
      fetchImpl,
    })

    const second = JSON.parse(fetchImpl.mock.calls[1]![1].body as string)
    expect(second.messages[2].content[0]).toMatchObject({ is_error: true })
  })

  it('reports refusals and server errors', async () => {
    const refused = await askAssistant({
      history: [],
      question: 'x',
      records: [],
      loadFile: vi.fn(),
      fetchImpl: vi.fn().mockResolvedValue(reply({ stop_reason: 'refusal', content: [] })),
    })
    expect(refused.refused).toBe(true)

    await expect(
      askAssistant({
        history: [],
        question: 'x',
        records: [],
        loadFile: vi.fn(),
        fetchImpl: vi.fn().mockResolvedValue(reply({ error: 'Assistant is not configured' }, 503)),
      }),
    ).rejects.toEqual(new AssistantError(503, 'Assistant is not configured'))
  })
})
