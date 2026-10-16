import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useMoodStore } from '@/features/mood-check-in'
import { dateKey } from '@/shared/utils/date'

import { promptFor } from '../prompts'
import { useJournalStore } from '../useJournalStore'
import { JournalHub } from './JournalHub'

describe('JournalHub', () => {
  beforeEach(() => {
    useJournalStore.setState({ entries: [] })
    useMoodStore.setState({ checkIns: {} })
  })
  afterEach(() => vi.restoreAllMocks())

  it("saves an entry with today's prompt and mood, then edits and deletes it", async () => {
    const user = userEvent.setup()
    useMoodStore.setState({ checkIns: { [dateKey()]: 'good' } })
    render(<JournalHub />)
    const prompt = promptFor(new Date())

    const form = screen.getByRole('form', { name: 'New journal entry' })
    expect(within(form).getByText(prompt)).toBeInTheDocument()
    expect(within(form).getByText(/today's mood: Good/)).toBeInTheDocument()

    await user.type(within(form).getByRole('textbox', { name: prompt }), 'A walk in the sun.')
    await user.click(within(form).getByRole('button', { name: 'Save entry' }))

    const today = screen.getByRole('region', { name: 'Today' })
    expect(within(today).getByText('A walk in the sun.')).toBeInTheDocument()
    expect(within(today).getByText(prompt)).toBeInTheDocument()
    expect(within(today).getByText('Good')).toBeInTheDocument()
    expect(screen.getByText(/1 entry/)).toBeInTheDocument()

    await user.click(within(today).getByRole('button', { name: 'Edit' }))
    const editor = within(today).getByRole('textbox', { name: 'Edit entry' })
    await user.clear(editor)
    await user.type(editor, 'A long walk in the sun.')
    await user.click(within(today).getByRole('button', { name: 'Save' }))
    expect(within(today).getByText('A long walk in the sun.')).toBeInTheDocument()
    expect(within(today).getByText(/edited/)).toBeInTheDocument()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(within(today).getByRole('button', { name: 'Delete entry' }))
    expect(screen.getByText('Your entries will appear here.')).toBeInTheDocument()
  })

  it('supports free writing, other prompts and search', async () => {
    const user = userEvent.setup()
    render(<JournalHub />)
    const form = screen.getByRole('form', { name: 'New journal entry' })

    await user.click(within(form).getByRole('button', { name: 'Another prompt' }))
    expect(within(form).getByText(promptFor(new Date(), 1))).toBeInTheDocument()

    await user.click(within(form).getByRole('button', { name: 'Write freely' }))
    await user.type(within(form).getByRole('textbox'), 'Coffee with Ana')
    await user.click(within(form).getByRole('button', { name: 'Save entry' }))
    await user.type(within(form).getByRole('textbox'), 'Rainy afternoon')
    await user.click(within(form).getByRole('button', { name: 'Save entry' }))

    await user.type(screen.getByRole('searchbox', { name: 'Search entries' }), 'rain')
    expect(screen.getByText('Rainy afternoon')).toBeInTheDocument()
    expect(screen.queryByText('Coffee with Ana')).not.toBeInTheDocument()
    expect(useJournalStore.getState().entries.every((e) => e.prompt === undefined)).toBe(true)
  })
})
