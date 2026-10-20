import { useQuery } from '@tanstack/react-query'

import { enabledProviders } from '../account'
import { useAuthStore } from '../useAuthStore'

export const accountKeys = {
  all: ['account'] as const,
  providers: () => [...accountKeys.all, 'providers'] as const,
}

/** The sign-in methods switched on in the Supabase project (Google, Apple, phone). */
export function useEnabledProviders() {
  const configured = useAuthStore((s) => s.status !== 'unconfigured')
  return useQuery({
    queryKey: accountKeys.providers(),
    queryFn: enabledProviders,
    enabled: configured,
    staleTime: Infinity,
  })
}
