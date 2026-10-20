import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { renderWithProviders } from '@/test/utils'

import * as account from '../account'
import { useSyncStore } from '../sync/useSyncStore'
import { useAuthStore } from '../useAuthStore'
import { AccountCard } from './AccountCard'
import { SignInScreen } from './SignInScreen'

const renderSignIn = (route = '/sign-in?next=/profile') =>
  renderWithProviders(
    <Routes>
      <Route path="/sign-in" element={<SignInScreen />} />
      <Route path="/profile" element={<p>Profile page</p>} />
      <Route path="/welcome" element={<p>Welcome page</p>} />
    </Routes>,
    { route },
  )

describe('SignInScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({ status: 'signedOut', user: null })
    useSyncStore.setState({ status: 'idle' })
    vi.spyOn(account, 'enabledProviders').mockResolvedValue({
      google: true,
      apple: true,
      phone: true,
    })
  })
  afterEach(() => vi.restoreAllMocks())

  it('signs in with a phone number, restores the backup and continues', async () => {
    const user = userEvent.setup()
    const send = vi.spyOn(account, 'sendPhoneCode').mockResolvedValue()
    const verify = vi.spyOn(account, 'verifyPhoneCode').mockResolvedValue()
    const sync = vi.spyOn(account, 'syncNow').mockImplementation(async () => {
      useProfileStore.setState({ onboarded: true })
    })
    renderSignIn()

    expect(await screen.findByRole('button', { name: 'Continue with Google' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Apple' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Continue with phone number/ }))

    await user.type(screen.getByLabelText('Your mobile number'), '123')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    expect(screen.getByRole('alert')).toHaveTextContent('10-digit')

    await user.clear(screen.getByLabelText('Your mobile number'))
    await user.type(screen.getByLabelText('Your mobile number'), '98765 43210')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    expect(send).toHaveBeenCalledWith('+919876543210')

    await user.type(screen.getByLabelText(/Enter the code sent to \+919876543210/), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify and sign in' }))

    expect(await screen.findByText('Profile page')).toBeInTheDocument()
    expect(verify).toHaveBeenCalledWith('+919876543210', '123456')
    expect(sync).toHaveBeenCalled()
  })

  it('carries on with sign-up when the account has no profile yet', async () => {
    const user = userEvent.setup()
    vi.spyOn(account, 'sendPhoneCode').mockResolvedValue()
    vi.spyOn(account, 'verifyPhoneCode').mockResolvedValue()
    vi.spyOn(account, 'syncNow').mockImplementation(async () => {
      useProfileStore.setState({ onboarded: false })
    })
    renderSignIn('/sign-in?next=/')
    await user.click(await screen.findByRole('button', { name: /Continue with phone number/ }))
    await user.type(screen.getByLabelText('Your mobile number'), '9876543210')
    await user.click(screen.getByRole('button', { name: 'Send code' }))
    await user.type(screen.getByLabelText(/Enter the code/), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify and sign in' }))
    expect(await screen.findByText('Welcome page')).toBeInTheDocument()
  })

  it('explains when accounts aren’t set up', () => {
    useAuthStore.setState({ status: 'unconfigured' })
    renderSignIn()
    expect(screen.getByRole('heading', { name: 'Accounts are coming soon' })).toBeInTheDocument()
  })
})

describe('AccountCard', () => {
  afterEach(() => vi.restoreAllMocks())

  it('invites signed-out people to back up', () => {
    useAuthStore.setState({ status: 'signedOut', user: null })
    renderWithProviders(<AccountCard />)
    expect(screen.getByRole('link', { name: 'Sign in or create an account' })).toHaveAttribute(
      'href',
      '/sign-in?next=/profile',
    )
  })

  it('shows backup status and signs out, optionally clearing the phone', async () => {
    const user = userEvent.setup()
    const signOut = vi.spyOn(account, 'signOut').mockResolvedValue()
    const reload = vi.fn()
    useAuthStore.setState({
      status: 'signedIn',
      user: { id: 'u1', phone: '+919876543210', email: null, name: null, provider: 'phone' },
    })
    useSyncStore.setState({ status: 'idle', lastSyncedAt: '2026-10-20T09:30:00Z' })
    renderWithProviders(<AccountCard reload={reload} />)

    expect(screen.getByText('☁️ Signed in with phone · +919876543210')).toBeInTheDocument()
    expect(screen.getByText(/^Backed up at/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    await user.click(screen.getByRole('checkbox', { name: /Also remove my data/ }))
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(signOut).toHaveBeenCalledWith({ removeLocalData: true })
    await vi.waitFor(() => expect(reload).toHaveBeenCalledWith('/welcome'))
  })

  it('asks what to do when the phone holds another account’s data', () => {
    useAuthStore.setState({
      status: 'signedIn',
      user: { id: 'u2', phone: null, email: 'a@b.c', name: null, provider: 'google' },
    })
    useSyncStore.setState({ status: 'otherAccount' })
    renderWithProviders(<AccountCard />)
    expect(
      screen.getByRole('heading', { name: 'This phone has someone else’s Thriver data' }),
    ).toBeInTheDocument()
  })
})
