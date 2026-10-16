import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/utils'

import { decodeNote, encodeNote, type FamilyNote } from '../notes'
import { useFamilyStore } from '../useFamilyStore'
import { NoteComposer } from './NoteComposer'
import { NotesWall } from './NotesWall'
import { ReceivedNote } from './ReceivedNote'

const note: FamilyNote = {
  id: 'n1',
  from: 'Dad',
  message: 'Proud of you, kiddo!',
  sticker: '⭐',
  color: 'bg-sleep',
  sentAt: '2026-10-15T18:00:00.000Z',
}

describe('family notes', () => {
  beforeEach(() => useFamilyStore.setState({ notes: [] }))
  afterEach(() => vi.restoreAllMocks())

  it('lets family write a note and turns it into a link carrying that note', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NoteComposer recipient="Harshitha" />)
    const form = screen.getByRole('form', { name: 'Write a note' })

    await user.type(within(form).getByLabelText('Your name'), 'Mum')
    await user.type(within(form).getByLabelText('Your message for Harshitha'), 'Big hugs today!')
    await user.click(within(form).getByRole('button', { name: 'Sticker 🌻' }))
    await user.click(within(form).getByRole('button', { name: 'Create link to send' }))

    expect(screen.getByRole('heading', { name: 'Now send it to Harshitha' })).toBeInTheDocument()
    const link = (screen.getByRole('textbox', { name: 'Link' }) as HTMLInputElement).value
    expect(link).toContain('/family/note#')
    expect(decodeNote(link.split('#')[1]!)).toMatchObject({
      from: 'Mum',
      message: 'Big hugs today!',
      sticker: '🌻',
    })
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/?text='),
    )
    // Sending by link doesn't save on the sender's phone.
    expect(useFamilyStore.getState().notes).toEqual([])
  })

  it('can leave a note directly on this phone', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NoteComposer recipient="Sam" />)
    await user.type(screen.getByLabelText('Your name'), 'Grandma')
    await user.type(screen.getByLabelText('Your message for Sam'), 'Drink water 💧')
    await user.click(screen.getByRole('button', { name: /leave it on this phone/ }))

    expect(screen.getByRole('status')).toHaveTextContent('Saved on this phone')
    expect(useFamilyStore.getState().notes[0]).toMatchObject({ from: 'Grandma' })
  })

  it('saves a received note once, even if the link is opened again', async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(<ReceivedNote payload={encodeNote(note)} />)

    expect(screen.getByText('⭐ Dad sent you a note!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Save to my notes' }))
    expect(screen.getByRole('status')).toHaveTextContent('Saved to your family notes')
    unmount()

    renderWithProviders(<ReceivedNote payload={encodeNote(note)} />)
    expect(screen.getByRole('status')).toHaveTextContent('already in your notes')
    expect(useFamilyStore.getState().notes).toHaveLength(1)
  })

  it('explains broken links', () => {
    renderWithProviders(<ReceivedNote payload="garbage" />)
    expect(screen.getByRole('alert')).toHaveTextContent(/This note link didn.t work/)
  })

  it('shows notes on the wall with hearts and delete', async () => {
    const user = userEvent.setup()
    useFamilyStore.setState({ notes: [note] })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderWithProviders(<NotesWall />)

    expect(screen.getByText('Proud of you, kiddo!')).toBeInTheDocument()
    const heart = screen.getByRole('button', { name: 'Love note from Dad' })
    await user.click(heart)
    expect(heart).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Delete note from Dad' }))
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
  })
})
