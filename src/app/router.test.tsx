import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { createQueryClient } from '@/shared/lib/queryClient'

import { routes } from './router'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('router', () => {
  beforeEach(() => useProfileStore.setState({ onboarded: true }))

  it('sends new users to sign-up first', async () => {
    useProfileStore.setState({ onboarded: false })
    renderRoute('/learn')
    expect(
      await screen.findByRole('heading', { name: 'Welcome to Thriver' }, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
  })

  it('renders the home page', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { name: /You’ve got this/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Today’s strength')).toBeInTheDocument()
  })

  it('merges appointments and medication into Care, redirecting old addresses', async () => {
    renderRoute('/medication')
    expect(await screen.findByRole('heading', { name: 'Medication' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Medication' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Care' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows Care, Learn, Records and Profile tabs', async () => {
    renderRoute('/learn')
    expect(await screen.findByRole('heading', { name: 'Learn' })).toBeInTheDocument()
    const tabs = screen.getByRole('navigation', { name: 'Main' })
    expect(
      within(tabs)
        .getAllByRole('link')
        .map((l) => l.textContent),
    ).toEqual(['Home', 'Care', 'Learn', 'Records', 'Profile'])
  })

  it('renders the 404 page for unknown routes', async () => {
    renderRoute('/does-not-exist')
    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
