import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'

import { renderWithProviders } from '@/test/utils'

import { emptyHealth } from '../health'
import { useProfileStore } from '../useProfileStore'
import { Onboarding } from './Onboarding'

const renderOnboarding = () =>
  renderWithProviders(
    <Routes>
      <Route path="/welcome" element={<Onboarding />} />
      <Route path="/" element={<p>Home screen</p>} />
    </Routes>,
    { route: '/welcome' },
  )

describe('Onboarding', () => {
  beforeEach(() =>
    useProfileStore.setState({
      name: '',
      onboarded: false,
      health: emptyHealth,
      aiPersonalise: false,
      aiConsentAt: null,
    }),
  )

  it('collects name, cancer details, conditions and AI consent', async () => {
    const user = userEvent.setup()
    renderOnboarding()

    await user.click(screen.getByRole('button', { name: 'Get started' }))
    await user.type(screen.getByRole('textbox', { name: 'Your name' }), 'Asha')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await user.click(screen.getByRole('button', { name: 'Breast' }))
    await user.click(screen.getByRole('button', { name: 'Surgery' }))
    await user.type(screen.getByLabelText(/Date of your/), '2026-09-23')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await user.click(screen.getByRole('checkbox', { name: /lymphoedema/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('checkbox', { name: /Personalise my picks with AI/ })).not.toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: /Personalise my picks with AI/ }))
    await user.click(screen.getByRole('button', { name: 'Finish' }))

    expect(screen.getByText('Home screen')).toBeInTheDocument()
    const state = useProfileStore.getState()
    expect(state).toMatchObject({ name: 'Asha', onboarded: true, aiPersonalise: true })
    expect(state.aiConsentAt).not.toBeNull()
    expect(state.health).toEqual({
      cancerType: 'breast',
      treatments: ['surgery'],
      surgeryDate: '2026-09-23',
      conditions: ['lymphoedema'],
    })
  })

  it('lets people skip sharing health details', async () => {
    const user = userEvent.setup()
    renderOnboarding()
    await user.click(screen.getByRole('button', { name: 'Get started' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'I’d rather not say' }))
    await user.click(screen.getByRole('button', { name: 'Finish' }))

    expect(useProfileStore.getState()).toMatchObject({
      onboarded: true,
      health: emptyHealth,
      aiPersonalise: false,
    })
  })
})
