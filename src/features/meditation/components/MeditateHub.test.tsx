import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/utils'

import { useMeditationStore } from '../useMeditationStore'
import { MeditateHub } from './MeditateHub'

describe('MeditateHub', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    useMeditationStore.setState({ history: [] })
  })
  afterEach(() => vi.useRealTimers())

  const user = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

  it('runs a session through its breath phases, pauses, and logs it on completion', async () => {
    renderWithProviders(<MeditateHub />)

    await user().click(screen.getByRole('button', { name: /^Start One-Minute Reset/ }))
    expect(screen.getByText('Breathe in')).toBeInTheDocument()
    expect(screen.getByLabelText('Time remaining')).toHaveTextContent('1:00 left')

    act(() => vi.advanceTimersByTime(4_000))
    expect(screen.getByText('Hold')).toBeInTheDocument()

    await user().click(screen.getByRole('button', { name: 'Pause' }))
    act(() => vi.advanceTimersByTime(30_000))
    expect(screen.getByText('Hold')).toBeInTheDocument() // paused: no progress
    expect(screen.getByLabelText('Time remaining')).toHaveTextContent('0:56 left')

    await user().click(screen.getByRole('button', { name: 'Resume' }))
    act(() => vi.advanceTimersByTime(57_000))

    expect(screen.getByRole('heading', { name: 'Well done' })).toBeInTheDocument()
    expect(useMeditationStore.getState().history).toEqual([
      expect.objectContaining({ sessionId: 'reset-1', minutes: 1 }),
    ])

    await user().click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByText('Minutes').nextElementSibling).toHaveTextContent('1')
  })

  it('opens a session straight from a link and does not log when ended early', async () => {
    renderWithProviders(<MeditateHub />, { route: '/meditate?session=breathing-5' })

    expect(screen.getByRole('region', { name: /5-Minute Mindful Breathing in progress/ }))
    await user().click(screen.getByRole('button', { name: 'End' }))

    expect(screen.getByRole('heading', { name: 'Sessions' })).toBeInTheDocument()
    expect(useMeditationStore.getState().history).toEqual([])
  })
})
