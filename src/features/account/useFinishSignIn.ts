import { useNavigate } from 'react-router'

import { useProfileStore } from '@/features/profile'

import { syncNow } from './account'
import { useSyncStore } from './sync/useSyncStore'

/**
 * After signing in: restore the backup (first sync), then continue. People whose account has no
 * profile yet carry on with sign-up from the name step.
 */
export function useFinishSignIn() {
  const navigate = useNavigate()
  return async (next: string) => {
    await syncNow()
    if (useSyncStore.getState().status === 'otherAccount') return 'otherAccount' as const
    const onboarded = useProfileStore.getState().onboarded
    navigate(onboarded ? next : '/welcome?step=1', { replace: true })
    return 'done' as const
  }
}
