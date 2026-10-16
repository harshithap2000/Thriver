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
      { path: 'explore', lazy: lazyPage(() => import('@/pages/ExplorePage')) },
      { path: 'journal', lazy: lazyPage(() => import('@/pages/JournalPage')) },
      { path: 'profile', lazy: lazyPage(() => import('@/pages/ProfilePage')) },
      { path: 'posts', lazy: lazyPage(() => import('@/pages/PostsPage')) },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage')) },
    ],
  },
]

export const router = createBrowserRouter(routes)
