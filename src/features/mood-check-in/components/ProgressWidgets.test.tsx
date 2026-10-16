import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { lastNDays } from '../stats'
import { dateKey, useMoodStore } from '../useMoodStore'
import { CheckInStats } from './CheckInStats'
import { ClearHistoryButton } from './ClearHistoryButton'
import { MoodWeek } from './MoodWeek'

const [twoDaysAgo, yesterday, today] = lastNDays(3).map((d) => dateKey(d))

describe('mood progress widgets', () => {
  beforeEach(() =>
    useMoodStore.setState({
      checkIns: { [twoDaysAgo!]: 'tired', [yesterday!]: 'good', [today!]: 'good' },
    }),
  )
  afterEach(() => vi.restoreAllMocks())

  it('shows streak, total and most felt mood', () => {
    render(<CheckInStats />)

    const valueFor = (label: string) => screen.getByText(label).nextElementSibling

    expect(valueFor('Day streak')).toHaveTextContent('3')
    expect(valueFor('Check-ins')).toHaveTextContent('3')
    expect(valueFor('Most felt')).toHaveTextContent('Good')
  })

  it("labels each of the week's days with its mood", () => {
    render(<MoodWeek />)

    const days = screen.getAllByRole('listitem')
    expect(days).toHaveLength(7)
    expect(days.at(-1)).toHaveAccessibleName(/: Good$/)
    expect(days.at(-3)).toHaveAccessibleName(/: Tired$/)
    expect(days[0]).toHaveAccessibleName(/: no check-in$/)
  })

  it('clears history only after confirmation', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false)
    render(<ClearHistoryButton />)
    const button = screen.getByRole('button', { name: 'Clear check-in history' })

    await userEvent.click(button)
    expect(Object.keys(useMoodStore.getState().checkIns)).toHaveLength(3)

    confirm.mockReturnValueOnce(true)
    await userEvent.click(button)
    expect(useMoodStore.getState().checkIns).toEqual({})
    expect(button).toBeDisabled()
  })
})
