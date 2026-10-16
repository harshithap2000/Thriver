import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'

import { renderWithProviders } from '@/test/utils'

import { loadFile } from '../fileStore'
import { useRecordsStore } from '../useRecordsStore'
import { RecordDetail } from './RecordDetail'
import { RecordsHub } from './RecordsHub'

describe('records', () => {
  beforeEach(() => {
    useRecordsStore.setState({ records: [] })
    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()
  })
  afterEach(() => vi.restoreAllMocks())

  it('saves a PDF with its details on this device and lists it', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RecordsHub />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    const form = screen.getByRole('form', { name: 'Add record' })
    const pdf = new File(['%PDF-1.7 test'], 'full_blood-count.pdf', { type: 'application/pdf' })
    await user.upload(within(form).getByLabelText('Document or photo'), pdf)

    expect(within(form).getByLabelText('Title')).toHaveValue('full blood count')
    await user.type(within(form).getByLabelText('From'), 'City Lab')
    await user.click(within(form).getByRole('button', { name: 'Save record' }))

    const link = await screen.findByRole('link', { name: /full blood count/ })
    expect(link).toHaveTextContent('City Lab')
    const saved = useRecordsStore.getState().records[0]!
    expect(saved).toMatchObject({
      category: 'lab',
      mimeType: 'application/pdf',
      provider: 'City Lab',
    })
    // (The test IndexedDB can't round-trip jsdom Blobs faithfully; real browsers can.)
    expect(await loadFile(saved.id)).toBeDefined()
  })

  it('rejects unsupported files', async () => {
    const user = userEvent.setup({ applyAccept: false })
    renderWithProviders(<RecordsHub />)
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.upload(
      screen.getByLabelText('Document or photo'),
      new File(['x'], 'notes.docx', { type: 'application/msword' }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Please choose a PDF or a photo')
  })

  it('filters by search and shows, then deletes, a record', async () => {
    const user = userEvent.setup()
    const { addRecord } = useRecordsStore.getState()
    const img = new File(['img'], 'xray.png', { type: 'image/png' })
    const xray = await addRecord(
      {
        title: 'Chest X-ray',
        category: 'imaging',
        date: '2026-08-02',
        provider: 'St Mary',
        notes: '',
      },
      img,
    )
    await addRecord(
      { title: 'Flu jab', category: 'vaccination', date: '2026-10-01', provider: '', notes: '' },
      new File(['x'], 'flu.pdf', { type: 'application/pdf' }),
    )

    const { unmount } = renderWithProviders(<RecordsHub />)
    await user.type(screen.getByRole('searchbox', { name: 'Search records' }), 'mary')
    expect(screen.getByRole('link', { name: /Chest X-ray/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Flu jab/ })).not.toBeInTheDocument()
    unmount()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderWithProviders(
      <Routes>
        <Route path="/records/:id" element={<RecordDetail id={xray.id} />} />
        <Route path="/records" element={<p>Records list</p>} />
      </Routes>,
      { route: `/records/${xray.id}` },
    )
    expect(screen.getByRole('heading', { name: 'Chest X-ray' })).toBeInTheDocument()
    expect(await screen.findByRole('img', { name: 'Chest X-ray' })).toHaveAttribute(
      'src',
      'blob:mock',
    )
    expect(screen.getByRole('link', { name: /Explain this record/ })).toHaveAttribute(
      'href',
      `/records/assistant?about=${xray.id}`,
    )

    await user.click(screen.getByRole('button', { name: /Delete record/ }))
    expect(await screen.findByText('Records list')).toBeInTheDocument()
    expect(useRecordsStore.getState().records.map((r) => r.title)).toEqual(['Flu jab'])
    expect(await loadFile(xray.id)).toBeUndefined()
  })
})
