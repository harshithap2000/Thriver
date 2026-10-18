import type { ComponentType } from 'react'
import { createBrowserRouter, redirect, type RouteObject } from 'react-router'

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
      { path: 'care', lazy: lazyPage(() => import('@/pages/CarePage')) },
      // Old addresses from before Calendar and Medication were merged into Care.
      { path: 'appointments', loader: () => redirect('/care?view=appointments') },
      { path: 'medication', loader: () => redirect('/care?view=medication') },
      { path: 'learn', lazy: lazyPage(() => import('@/pages/LearnPage')) },
      { path: 'learn/:slug', lazy: lazyPage(() => import('@/pages/GuidePage')) },
      { path: 'meditate', lazy: lazyPage(() => import('@/pages/MeditatePage')) },
      { path: 'games', lazy: lazyPage(() => import('@/pages/GamesPage')) },
      { path: 'family', lazy: lazyPage(() => import('@/pages/FamilyPage')) },
      { path: 'family/write', lazy: lazyPage(() => import('@/pages/FamilyWritePage')) },
      { path: 'family/note', lazy: lazyPage(() => import('@/pages/FamilyNotePage')) },
      { path: 'records', lazy: lazyPage(() => import('@/pages/RecordsPage')) },
      { path: 'records/assistant', lazy: lazyPage(() => import('@/pages/RecordsAssistantPage')) },
      { path: 'records/:id', lazy: lazyPage(() => import('@/pages/RecordDetailPage')) },
      { path: 'move', lazy: lazyPage(() => import('@/pages/MovePage')) },
      { path: 'journal', lazy: lazyPage(() => import('@/pages/JournalPage')) },
      { path: 'profile', lazy: lazyPage(() => import('@/pages/ProfilePage')) },
      { path: 'profile/health', lazy: lazyPage(() => import('@/pages/HealthProfilePage')) },
      { path: 'welcome', lazy: lazyPage(() => import('@/pages/WelcomePage')) },
      { path: 'posts', lazy: lazyPage(() => import('@/pages/PostsPage')) },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage')) },
    ],
  },
]

export const router = createBrowserRouter(routes)
