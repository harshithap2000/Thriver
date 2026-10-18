import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'

import { useMoodStore } from '@/features/mood-check-in'
import { emptyHealth, useProfileStore } from '@/features/profile'
import { renderWithProviders } from '@/test/utils'

import { useRecoveryStore } from '../useRecoveryStore'
import { CheckInPrompt } from './CheckInPrompt'
import { RecoveryPhases } from './RecoveryPhases'
import { SafetyAlert } from './SafetyAlert'
import { SymptomCheckIn } from './SymptomCheckIn'
import { TodaysPlan } from './TodaysPlan'

const renderApp = (route: string) =>
  renderWithProviders(
    <Routes>
      <Route
        path="/"
        element={
          <>
            <CheckInPrompt />
            <TodaysPlan />
          </>
        }
      />
      <Route path="/check-in" element={<SymptomCheckIn />} />
      <Route path="/check-in/alert" element={<SafetyAlert />} />
      <Route path="/move" element={<RecoveryPhases />} />
    </Routes>,
    { route },
  )

describe('daily check-in', () => {
  beforeEach(() => {
    useRecoveryStore.setState({ checkIns: {}, clearances: {}, planDone: {} })
    useMoodStore.setState({ checkIns: {} })
    useProfileStore.setState({
      health: { ...emptyHealth, cancerType: 'breast', treatments: ['surgery'] },
      careTeam: { name: 'City Hospital', phone: '080 1234 5678' },
    })
  })

  it('saves symptoms and mood, then thanks the person on Home', async () => {
    const user = userEvent.setup()
    renderApp('/check-in')
    await user.click(screen.getByRole('radio', { name: 'Good' }))
    await user.click(screen.getByRole('button', { name: 'Save check-in' }))

    expect(screen.getByText('Thanks for checking in')).toBeInTheDocument()
    expect(Object.values(useMoodStore.getState().checkIns)).toEqual(['good'])
    expect(
      screen.getByRole('button', { name: 'Short walks at home: not done' }),
    ).toBeInTheDocument()
  })

  it('pauses exercise and shows who to call when a warning sign is reported', async () => {
    const user = userEvent.setup()
    renderApp('/check-in')
    const fever = screen.getByRole('group', { name: /Fever/ })
    await user.click(screen.getAllByRole('radio', { name: 'Yes' })[0]!)
    expect(fever).toContainElement(screen.getAllByRole('radio', { name: 'Yes' })[0]!)
    await user.click(screen.getByRole('button', { name: 'Save check-in' }))

    expect(screen.getByRole('heading', { name: 'Let’s pause exercise today' })).toBeInTheDocument()
    expect(screen.getByText(/fever of 38°C/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Call City Hospital/ })).toHaveAttribute(
      'href',
      'tel:08012345678',
    )
    expect(screen.getByRole('link', { name: 'Emergency 112' })).toHaveAttribute('href', 'tel:112')
    expect(screen.getByRole('link', { name: 'Ambulance 108' })).toHaveAttribute('href', 'tel:108')
  })

  it('hides exercise from today’s plan and Move after a warning sign', () => {
    const today = new Date()
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    useRecoveryStore.setState({
      checkIns: { [key]: { tiredness: 5, pain: 2, warnings: ['fever'] } },
    })
    renderApp('/')
    expect(screen.getByText('Exercise is paused today')).toBeInTheDocument()
    expect(screen.queryByText('Short walks at home')).not.toBeInTheDocument()
    expect(screen.getByText('Follow your hospital’s instructions')).toBeInTheDocument()
  })
})
