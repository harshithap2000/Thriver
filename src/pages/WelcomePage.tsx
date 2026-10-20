import { useSearchParams } from 'react-router'

import { useAuthStore } from '@/features/account'
import { Onboarding } from '@/features/profile'

export default function WelcomePage() {
  const [params] = useSearchParams()
  const status = useAuthStore((s) => s.status)
  const name = useAuthStore((s) => s.user?.name)
  return (
    <Onboarding
      // Re-mount when signing in, so the name step picks up the suggested name.
      key={status}
      accountsEnabled={status !== 'unconfigured'}
      startStep={params.get('step') === '1' ? 1 : 0}
      suggestedName={name ?? ''}
    />
  )
}
