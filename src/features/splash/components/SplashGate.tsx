import { useEffect, useState, type ReactNode } from 'react'

import { SplashScreen } from './SplashScreen'

const FADE_MS = 500

type Phase = 'showing' | 'leaving' | 'done'

interface SplashGateProps {
  children: ReactNode
  /** How long the splash stays fully visible before fading out. */
  durationMs?: number
}

/**
 * Shows the splash screen over the app when it opens. The app renders underneath straight away,
 * so lazy routes and data start loading while the splash is visible. Tapping skips it.
 */
export function SplashGate({ children, durationMs = 2200 }: SplashGateProps) {
  const [phase, setPhase] = useState<Phase>('showing')

  useEffect(() => {
    if (phase === 'showing') {
      const id = setTimeout(() => setPhase('leaving'), durationMs)
      return () => clearTimeout(id)
    }
    if (phase === 'leaving') {
      const id = setTimeout(() => setPhase('done'), FADE_MS)
      return () => clearTimeout(id)
    }
  }, [phase, durationMs])

  return (
    <>
      {children}
      {phase !== 'done' && (
        <SplashScreen leaving={phase === 'leaving'} onSkip={() => setPhase('leaving')} />
      )}
    </>
  )
}
