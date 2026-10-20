import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { inputClass } from '@/shared/ui/Field'
import { ChevronLeftIcon } from '@/shared/ui/icons'
import { Spinner } from '@/shared/ui/Spinner'

import {
  normalisePhone,
  sendPhoneCode,
  signInWithProvider,
  verifyPhoneCode,
  type OAuthProvider,
} from '../account'
import { useEnabledProviders } from '../hooks/useEnabledProviders'
import { useAuthStore } from '../useAuthStore'
import { useFinishSignIn } from '../useFinishSignIn'
import { OtherAccountNotice } from './OtherAccountNotice'
import { AppleIcon, GoogleIcon } from './ProviderIcons'

const bigButton =
  'flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold disabled:opacity-50'

/** Sign in or create an account: Google, Apple or phone number (whichever are enabled). */
export function SignInScreen() {
  const [params] = useSearchParams()
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/profile'
  const status = useAuthStore((s) => s.status)
  const finish = useFinishSignIn()
  const providers = useEnabledProviders()

  const [step, setStep] = useState<'choose' | 'phone' | 'code' | 'restoring' | 'otherAccount'>(
    'choose',
  )
  const [phoneInput, setPhoneInput] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const oauth = (provider: OAuthProvider) => run(() => signInWithProvider(provider, next))

  const submitPhone = (e: FormEvent) => {
    e.preventDefault()
    const normalised = normalisePhone(phoneInput)
    if (!normalised)
      return setError('Enter a 10-digit mobile number, or start with + and the country code.')
    void run(async () => {
      await sendPhoneCode(normalised)
      setPhone(normalised)
      setStep('code')
    })
  }

  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    void run(async () => {
      await verifyPhoneCode(phone, code.trim())
      setStep('restoring')
      if ((await finish(next)) === 'otherAccount') setStep('otherAccount')
    })
  }

  const back = (
    <Link
      to={next === '/' ? '/welcome' : next}
      className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
    >
      <ChevronLeftIcon className="size-4" /> Back
    </Link>
  )

  if (status === 'unconfigured') {
    return (
      <div className="space-y-4">
        {back}
        <h1 className="text-ink text-2xl font-extrabold">Accounts are coming soon</h1>
        <p className="text-ink-muted">
          This version of Thriver keeps everything on this phone. Signing in and backup will be
          available soon.
        </p>
      </div>
    )
  }

  if (step === 'restoring') {
    return (
      <div className="flex justify-center py-24 text-lg">
        <Spinner label="Restoring your data…" />
      </div>
    )
  }

  if (step === 'otherAccount') return <OtherAccountNotice />

  return (
    <div className="space-y-6">
      {back}
      <header className="space-y-2">
        <h1 className="text-ink text-[1.75rem] leading-tight font-extrabold">Back up and sync</h1>
        <p className="text-ink-muted text-lg">
          Sign in so your data is safe if you lose or change your phone, and use Thriver on more
          than one device.
        </p>
      </header>

      {step === 'choose' && (
        <div className="space-y-3">
          {providers.isPending && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}
          {providers.isError && (
            <p role="alert" className="text-move-ink font-semibold">
              Couldn’t reach the sign-in service. Check your connection and try again.
            </p>
          )}
          {providers.data?.google && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void oauth('google')}
              className={`${bigButton} text-ink border-ink-muted/25 border bg-white shadow-sm`}
            >
              <GoogleIcon className="size-6" /> Continue with Google
            </button>
          )}
          {providers.data?.apple && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void oauth('apple')}
              className={`${bigButton} bg-black text-white`}
            >
              <AppleIcon className="size-6" /> Continue with Apple
            </button>
          )}
          {providers.data?.phone && (
            <button
              type="button"
              disabled={busy}
              onClick={() => setStep('phone')}
              className={`${bigButton} bg-pine hover:bg-ink text-white`}
            >
              📱 Continue with phone number
            </button>
          )}
          {providers.data && (
            <p className="text-ink-muted text-center text-sm">
              On a shared phone, choose your own account.
            </p>
          )}
        </div>
      )}

      {step === 'phone' && (
        <form onSubmit={submitPhone} aria-label="Phone number" className="space-y-3">
          <label htmlFor="phone" className="text-ink block font-bold">
            Your mobile number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className={`${inputClass} py-3.5 text-lg`}
          />
          <p className="text-ink-muted text-sm">We’ll text you a 6-digit code.</p>
          <button type="submit" disabled={busy} className={`${bigButton} bg-pine text-white`}>
            {busy ? 'Sending…' : 'Send code'}
          </button>
          <button
            type="button"
            onClick={() => setStep('choose')}
            className="text-ink-muted w-full text-sm font-semibold"
          >
            Other ways to sign in
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={submitCode} aria-label="Verification code" className="space-y-3">
          <label htmlFor="code" className="text-ink block font-bold">
            Enter the code sent to {phone}
          </label>
          <input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className={`${inputClass} py-3.5 text-center text-2xl tracking-[0.4em]`}
          />
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className={`${bigButton} bg-pine text-white`}
          >
            {busy ? 'Checking…' : 'Verify and sign in'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setCode('')
              setStep('phone')
            }}
            className="text-ink-muted w-full text-sm font-semibold"
          >
            Change number or resend
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="text-move-ink font-semibold">
          {error}
        </p>
      )}

      <div className="space-y-2 text-center">
        <Link to={next === '/' ? '/welcome' : next} className="text-pine font-bold underline">
          Continue without an account
        </Link>
        <p className="text-ink-muted text-xs">
          Your backup is private to your account. Records and journal entries stay on this phone for
          now.
        </p>
      </div>
    </div>
  )
}
