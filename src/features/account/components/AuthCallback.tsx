import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { Spinner } from '@/shared/ui/Spinner'

import { takeNext } from '../account'
import { useAuthStore } from '../useAuthStore'
import { useFinishSignIn } from '../useFinishSignIn'
import { OtherAccountNotice } from './OtherAccountNotice'

const TIMEOUT_MS = 20_000

/** Where Google and Apple send people back to. Supabase finishes the sign-in from the URL. */
export function AuthCallback() {
  const status = useAuthStore((s) => s.status)
  const finish = useFinishSignIn()
  const started = useRef(false)
  const [state, setState] = useState<'working' | 'otherAccount' | 'failed'>(() =>
    new URLSearchParams(window.location.search).has('error') ? 'failed' : 'working',
  )

  useEffect(() => {
    if (status !== 'signedIn' || started.current) return
    started.current = true
    void finish(takeNext()).then((result) => {
      if (result === 'otherAccount') setState('otherAccount')
    })
  }, [status, finish])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!started.current) setState('failed')
    }, TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [])

  if (state === 'otherAccount') return <OtherAccountNotice />
  if (state === 'failed') {
    const reason = new URLSearchParams(window.location.search).get('error_description')
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-ink text-2xl font-extrabold">Couldn’t finish signing in</h1>
        <p className="text-ink-muted">{reason ?? 'Please try again.'}</p>
        <Link to="/sign-in" className="text-pine font-bold underline">
          Try again
        </Link>
      </div>
    )
  }
  return (
    <div className="flex justify-center py-24 text-lg">
      <Spinner label="Signing you in…" />
    </div>
  )
}
