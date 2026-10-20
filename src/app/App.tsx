import { useEffect } from 'react'
import { RouterProvider } from 'react-router'

import { startAccount } from '@/features/account'

import { SplashGate } from '@/features/splash'

import { AppErrorBoundary } from './AppErrorBoundary'
import { AppProviders } from './providers'
import { router } from './router'

export function App() {
  // Accounts and background sync (no-op when Supabase isn't configured).
  useEffect(() => startAccount(), [])

  return (
    <AppErrorBoundary>
      <AppProviders>
        <SplashGate>
          <RouterProvider router={router} />
        </SplashGate>
      </AppProviders>
    </AppErrorBoundary>
  )
}
