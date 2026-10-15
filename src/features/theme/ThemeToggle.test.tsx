import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeToggle } from './ThemeToggle'
import { useThemeStore } from './useThemeStore'

describe('ThemeToggle', () => {
  beforeEach(() => useThemeStore.setState({ theme: 'light' }))

  it('toggles the theme and the <html> dark class', async () => {
    render(<ThemeToggle />)

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(useThemeStore.getState().theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })
})
