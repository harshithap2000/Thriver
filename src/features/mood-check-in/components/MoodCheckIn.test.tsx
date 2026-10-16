import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { dateKey } from '@/shared/utils/date'

import { useMoodStore } from '../useMoodStore'
import { MoodCheckIn } from './MoodCheckIn'

describe('MoodCheckIn', () => {
  beforeEach(() => useMoodStore.setState({ checkIns: {} }))

  it("records today's mood and lets the user change it", async () => {
    render(<MoodCheckIn />)
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Good' }))

    expect(screen.getByRole('button', { name: 'Good' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/feeling good today/)).toBeInTheDocument()
    expect(useMoodStore.getState().checkIns[dateKey()]).toBe('good')

    await userEvent.click(screen.getByRole('button', { name: 'Tired' }))

    expect(screen.getByRole('button', { name: 'Good' })).toHaveAttribute('aria-pressed', 'false')
    expect(useMoodStore.getState().checkIns[dateKey()]).toBe('tired')
  })

  it("ignores previous days' check-ins", () => {
    useMoodStore.setState({ checkIns: { '2020-01-01': 'great' } })
    render(<MoodCheckIn />)

    expect(screen.getByRole('button', { name: 'Great' })).toHaveAttribute('aria-pressed', 'false')
  })
})
