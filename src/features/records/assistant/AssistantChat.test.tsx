import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/utils'

import type * as FileStore from '../fileStore'
import { useRecordsStore } from '../useRecordsStore'
import { AssistantChat } from './AssistantChat'
import { useAssistantConsent } from './useAssistantConsent'

// The test IndexedDB can't round-trip jsdom Blobs, so serve record files directly.
vi.mock('../fileStore', async (importOriginal) => ({
  ...(await importOriginal<typeof FileStore>()),
  loadFile: vi.fn(async () => new Blob(['%PDF'], { type: 'application/pdf' })),
}))

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('AssistantChat', () => {
  beforeEach(async () => {
    useAssistantConsent.setState({ consented: false, language: 'en' })
    useRecordsStore.setState({ records: [] })
    await useRecordsStore
      .getState()
      .addRecord(
        { title: 'Lipid panel', category: 'lab', date: '2026-09-30', provider: '', notes: '' },
        new File(['%PDF'], 'lipids.pdf', { type: 'application/pdf' }),
      )
  })
  afterEach(() => vi.restoreAllMocks())

  it('asks for consent, then answers using the records it opened', async () => {
    const user = userEvent.setup()
    const id = useRecordsStore.getState().records[0]!.id
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        json({
          stop_reason: 'tool_use',
          content: [{ type: 'tool_use', id: 't1', name: 'read_record', input: { record_id: id } }],
        }),
      )
      .mockResolvedValueOnce(
        json({
          stop_reason: 'end_turn',
          content: [{ type: 'text', text: 'Your cholesterol is in range.' }],
        }),
      )
    renderWithProviders(<AssistantChat />)

    expect(screen.getByText(/sent to Anthropic/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'I understand, continue' }))

    await user.click(screen.getByRole('button', { name: /most recent blood test/ }))
    expect(await screen.findByText('Your cholesterol is in range.')).toBeInTheDocument()
    expect(screen.getByLabelText('Records read')).toHaveTextContent('Lipid panel')
    expect(fetchSpy).toHaveBeenCalledWith('/api/records-assistant', expect.anything())
  })

  it('pre-fills a question about a specific record and explains setup errors', async () => {
    const user = userEvent.setup()
    useAssistantConsent.setState({ consented: true })
    const id = useRecordsStore.getState().records[0]!.id
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({ error: 'Assistant is not configured' }, 503),
    )
    renderWithProviders(<AssistantChat />, { route: `/records/assistant?about=${id}` })

    const box = screen.getByRole('textbox', { name: 'Ask about your records' })
    expect(box).toHaveValue('Explain my "Lipid panel" from 2026-09-30 in simple terms.')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText(/isn’t set up yet/)).toBeInTheDocument()
  })

  it('switches to Hindi and sends the language and profile with each question', async () => {
    const user = userEvent.setup()
    useAssistantConsent.setState({ consented: true })
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        json({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'ठीक है' }] }),
      )
    const profile = {
      cancerType: 'Breast',
      treatments: ['surgery'],
      conditions: [],
      daysSinceSurgery: 23,
      phase: '2 · Return to activity',
    }
    renderWithProviders(<AssistantChat profile={{ context: profile, label: 'Breast cancer' }} />)
    expect(screen.getByText(/Using your profile: Breast cancer/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hindi' }))
    expect(screen.getByRole('heading', { name: /रिकॉर्ड सहायक/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /ब्लड रिपोर्ट/ }))

    expect(await screen.findByText('ठीक है')).toBeInTheDocument()
    const body = JSON.parse(String(fetchSpy.mock.calls[0]![1]!.body)) as { context: unknown }
    expect(body.context).toEqual({ language: 'hi', profile })
  })
})
