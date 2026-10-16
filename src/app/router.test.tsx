import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

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
  it('renders the home page', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { name: /You’ve got this/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders the 404 page for unknown routes', async () => {
    renderRoute('/does-not-exist')
    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
