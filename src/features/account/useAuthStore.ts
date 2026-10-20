import type { Session } from '@supabase/supabase-js'
import { create } from 'zustand'

export type AuthStatus = 'unconfigured' | 'loading' | 'signedOut' | 'signedIn'

export interface AccountUser {
  id: string
  phone: string | null
  email: string | null
  /** From Google or Apple, when shared; used to pre-fill the name step. */
  name: string | null
  /** How they signed in: 'google', 'apple' or 'phone'. */
  provider: string | null
}

interface AuthState {
  status: AuthStatus
  user: AccountUser | null
}

/** Who is signed in. Supabase keeps the session itself (in local storage) and refreshes it. */
export const useAuthStore = create<AuthState>()(() => ({
  status: 'loading',
  user: null,
}))

export function userFromSession(session: Session | null): AccountUser | null {
  const u = session?.user
  if (!u) return null
  const meta = u.user_metadata as { full_name?: unknown; name?: unknown }
  const name = typeof meta.full_name === 'string' ? meta.full_name : meta.name
  return {
    id: u.id,
    phone: u.phone ? `+${u.phone.replace(/^\+/, '')}` : null,
    email: u.email ?? null,
    name: typeof name === 'string' ? name : null,
    provider: typeof u.app_metadata.provider === 'string' ? u.app_metadata.provider : null,
  }
}
