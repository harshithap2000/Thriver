import type Anthropic from '@anthropic-ai/sdk'

import type { HealthRecord } from '../useRecordsStore'

type MessageParam = Anthropic.Beta.BetaMessageParam
type ContentBlock = Anthropic.Beta.BetaContentBlock
type ToolResult = Anthropic.Beta.BetaToolResultBlockParam

export const ASSISTANT_ENDPOINT = '/api/records-assistant'
const MAX_MODEL_TURNS = 8
/** The API's per-image limit. PDFs are bounded by the record size limit. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export class AssistantError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export interface TurnResult {
  /** Full conversation to send next time (includes documents read and model blocks, unchanged). */
  history: MessageParam[]
  reply: string
  /** Titles of records the assistant opened this turn. */
  opened: string[]
  refused: boolean
}

interface TurnOptions {
  history: MessageParam[]
  question: string
  records: HealthRecord[]
  loadFile: (id: string) => Promise<Blob | undefined>
  fetchImpl?: typeof fetch
}

async function blobToBase64(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

const catalogEntry = (r: HealthRecord) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  date: r.date,
  provider: r.provider,
  notes: r.notes,
  fileName: r.fileName,
  mimeType: r.mimeType,
})

/** Runs the read_record tool locally: the files never leave the device unless the model asks. */
async function readRecord(
  toolUse: Anthropic.Beta.BetaToolUseBlock,
  records: HealthRecord[],
  loadFile: TurnOptions['loadFile'],
  opened: string[],
): Promise<ToolResult> {
  const input = toolUse.input as { record_id?: unknown }
  const record =
    typeof input.record_id === 'string' ? records.find((r) => r.id === input.record_id) : undefined
  const error = (text: string): ToolResult => ({
    type: 'tool_result',
    tool_use_id: toolUse.id,
    is_error: true,
    content: text,
  })

  if (toolUse.name !== 'read_record') return error(`Unknown tool ${toolUse.name}`)
  if (!record) return error('No record with that id. Use an id from the list of records.')
  const blob = await loadFile(record.id)
  if (!blob) return error('The file for this record is missing on this device.')

  const label = { type: 'text' as const, text: `Record "${record.title}" (${record.date})` }
  const data = await blobToBase64(blob)
  opened.push(record.title)

  if (record.mimeType === 'application/pdf') {
    return {
      type: 'tool_result',
      tool_use_id: toolUse.id,
      content: [
        label,
        {
          type: 'document',
          title: record.title,
          source: { type: 'base64', media_type: 'application/pdf', data },
        },
      ],
    }
  }
  if (blob.size > MAX_IMAGE_BYTES) {
    return error('This photo is too large for the assistant to read (over 5 MB).')
  }
  return {
    type: 'tool_result',
    tool_use_id: toolUse.id,
    content: [
      label,
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: record.mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
          data,
        },
      },
    ],
  }
}

/**
 * One user question → final answer. Loops while the model asks to read records, executing
 * read_record in the browser and sending results back.
 */
export async function askAssistant({
  history,
  question,
  records,
  loadFile,
  fetchImpl = fetch,
}: TurnOptions): Promise<TurnResult> {
  const messages: MessageParam[] = [...history, { role: 'user', content: question }]
  const catalog = records.map(catalogEntry)
  const opened: string[] = []
  const texts: string[] = []

  for (let turn = 0; turn < MAX_MODEL_TURNS; turn++) {
    const response = await fetchImpl(ASSISTANT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, catalog }),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string }
      throw new AssistantError(
        response.status,
        body.error ?? 'The assistant could not answer right now',
      )
    }
    const result = (await response.json()) as {
      content: ContentBlock[]
      stop_reason: string | null
    }

    // Append the assistant turn unchanged (it may carry thinking or fallback blocks).
    messages.push({ role: 'assistant', content: result.content })
    for (const block of result.content)
      if (block.type === 'text' && block.text.trim()) texts.push(block.text.trim())

    if (result.stop_reason === 'refusal') {
      return { history: messages, reply: texts.join('\n\n'), opened, refused: true }
    }
    const toolUses = result.content.filter(
      (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use',
    )
    if (result.stop_reason !== 'tool_use' || toolUses.length === 0) {
      return { history: messages, reply: texts.join('\n\n'), opened, refused: false }
    }

    // All results for one assistant turn go back in a single user message.
    const toolResults = await Promise.all(
      toolUses.map((t) => readRecord(t, records, loadFile, opened)),
    )
    messages.push({ role: 'user', content: toolResults })
  }

  throw new AssistantError(500, 'The assistant took too many steps. Try a more specific question.')
}
