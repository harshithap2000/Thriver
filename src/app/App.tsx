import { RouterProvider } from 'react-router'

import { SplashGate } from '@/features/splash'

import { AppErrorBoundary } from './AppErrorBoundary'
import { AppProviders } from './providers'
import { router } from './router'

export function App() {
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
