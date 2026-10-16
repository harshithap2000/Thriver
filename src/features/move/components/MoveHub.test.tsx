import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/utils'

import { useMoveStore } from '../useMoveStore'
import { MoveHub } from './MoveHub'

describe('MoveHub', () => {
  beforeEach(() => useMoveStore.setState({ activities: [], dailyGoal: 20 }))
  afterEach(() => vi.useRealTimers())

  it('logs activities towards the daily goal and removes them', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MoveHub />)
    expect(screen.getByText('0 of 20 active minutes')).toBeInTheDocument()

    const form = screen.getByRole('form', { name: 'Log activity' })
    await user.click(within(form).getByRole('button', { name: /Yoga/ }))
    await user.click(within(form).getByRole('button', { name: '10 min' }))
    await user.click(within(form).getByRole('button', { name: 'Log activity' }))

    expect(screen.getByText('10 of 20 active minutes')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Active minutes today' })).toHaveAttribute(
      'aria-valuenow',
      '10',
    )
    expect(screen.getByRole('listitem', { name: /: 10 active minutes$/ })).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Daily goal' }), '10')
    expect(screen.getByText(/Goal reached/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Yoga, 10 minutes' }))
    expect(screen.getByText(/Nothing logged yet today/)).toBeInTheDocument()
  })

  it('guides through a routine, supports skipping, and logs it when finished', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProviders(<MoveHub />, { route: '/move?routine=desk-break' })

    expect(screen.getByText('Stand and reach')).toBeInTheDocument()
    expect(screen.getByText('Move 1 of 6')).toBeInTheDocument()
    expect(screen.getByText('Next: Chest opener')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(screen.getByText('Chest opener')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(30_000))
    expect(screen.getByText('Seated twist')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(200_000))
    expect(screen.getByRole('heading', { name: 'Nice moving!' })).toBeInTheDocument()
    expect(useMoveStore.getState().activities).toEqual([
      expect.objectContaining({ kind: 'routine', label: 'Desk Break', minutes: 3 }),
    ])
  })
})
