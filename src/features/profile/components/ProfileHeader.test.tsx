import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useProfileStore } from '../useProfileStore'
import { ProfileHeader } from './ProfileHeader'

describe('ProfileHeader', () => {
  beforeEach(() => useProfileStore.setState({ name: '', joinedAt: '2026-03-10T12:00:00.000Z' }))

  it('lets the user add, then cancel editing, their name', async () => {
    const user = userEvent.setup()
    render(<ProfileHeader />)

    expect(screen.getByRole('heading', { name: 'Welcome, friend' })).toBeInTheDocument()
    expect(screen.getByText(/Thriving since March 2026/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add your name' }))
    await user.type(screen.getByLabelText('What should we call you?'), '  Harshitha  ')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('heading', { name: 'Harshitha' })).toBeInTheDocument()
    expect(useProfileStore.getState().name).toBe('Harshitha')

    await user.click(screen.getByRole('button', { name: 'Edit name' }))
    await user.clear(screen.getByLabelText('What should we call you?'))
    await user.type(screen.getByLabelText('What should we call you?'), 'Someone else')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByRole('heading', { name: 'Harshitha' })).toBeInTheDocument()
  })
})
