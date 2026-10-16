import type { ComponentType } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'

import { AppShell } from './layouts/AppShell'
import { RouteError } from './RouteError'

// Pages are lazy-loaded so each route ships as its own chunk.
const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppShell,
    ErrorBoundary: RouteError,
    children: [
      { index: true, lazy: lazyPage(() => import('@/pages/HomePage')) },
      { path: 'appointments', lazy: lazyPage(() => import('@/pages/AppointmentsPage')) },
      { path: 'medication', lazy: lazyPage(() => import('@/pages/MedicationPage')) },
      { path: 'meditate', lazy: lazyPage(() => import('@/pages/MeditatePage')) },
      { path: 'activities', lazy: lazyPage(() => import('@/pages/ActivitiesPage')) },
      { path: 'journal', lazy: lazyPage(() => import('@/pages/JournalPage')) },
      { path: 'profile', lazy: lazyPage(() => import('@/pages/ProfilePage')) },
      { path: 'posts', lazy: lazyPage(() => import('@/pages/PostsPage')) },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage')) },
    ],
  },
]

export const router = createBrowserRouter(routes)
