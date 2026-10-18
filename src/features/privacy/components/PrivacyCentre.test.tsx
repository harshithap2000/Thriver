import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useProfileStore } from '@/features/profile'
import { useAssistantConsent } from '@/features/records'
import { renderWithProviders } from '@/test/utils'

import { collectAllData } from '../dataTools'
import { PrivacyCentre } from './PrivacyCentre'

describe('PrivacyCentre', () => {
  beforeEach(() => {
    localStorage.clear()
    useAssistantConsent.setState({ consented: true, consentedAt: '2026-10-14T10:00:00Z' })
    useProfileStore.setState({ aiPersonalise: true, aiConsentAt: '2026-10-12T10:00:00Z' })
  })

  it('lists consents and lets the person withdraw them', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PrivacyCentre />)
    expect(screen.getByText('Records assistant')).toBeInTheDocument()
    expect(screen.getByText('AI picks in Learn and Shop')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Withdraw consent: Records assistant' }))
    expect(useAssistantConsent.getState()).toMatchObject({ consented: false, consentedAt: null })
    await user.click(
      screen.getByRole('button', { name: 'Withdraw consent: AI picks in Learn and Shop' }),
    )
    expect(useProfileStore.getState().aiPersonalise).toBe(false)
    expect(screen.getByText(/haven’t agreed to share anything/)).toBeInTheDocument()
  })

  it('exports everything stored, and deletes it after confirmation', async () => {
    const user = userEvent.setup()
    localStorage.setItem('thriver-journal', JSON.stringify({ state: { entries: [1] } }))
    localStorage.setItem('other-app', 'keep')
    expect((await collectAllData()).data['thriver-journal']).toEqual({ state: { entries: [1] } })

    const onDeleted = vi.fn()
    renderWithProviders(<PrivacyCentre onDeleted={onDeleted} />)
    await user.click(screen.getByRole('button', { name: 'Delete everything from this phone' }))
    await user.click(screen.getByRole('button', { name: 'Yes, delete' }))

    await vi.waitFor(() => expect(onDeleted).toHaveBeenCalled())
    expect(localStorage.getItem('thriver-journal')).toBeNull()
    expect(localStorage.getItem('other-app')).toBe('keep')
  })
})
