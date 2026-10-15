import { act, fireEvent, render, screen } from '@testing-library/react'

import { SplashGate } from './SplashGate'

describe('SplashGate', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the splash over the app, then removes it after the duration', () => {
    render(
      <SplashGate durationMs={1000}>
        <p>App content</p>
      </SplashGate>,
    )

    expect(screen.getByRole('status', { name: 'Loading Thriver' })).toHaveTextContent('Thriver')
    expect(screen.getByText('App content')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('status', { name: 'Loading Thriver' })).toHaveClass('opacity-0')

    act(() => vi.advanceTimersByTime(500))
    expect(screen.queryByRole('status', { name: 'Loading Thriver' })).not.toBeInTheDocument()
  })

  it('can be skipped with a tap', () => {
    render(
      <SplashGate durationMs={10_000}>
        <p>App content</p>
      </SplashGate>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Skip intro' }))
    act(() => vi.advanceTimersByTime(500))

    expect(screen.queryByRole('status', { name: 'Loading Thriver' })).not.toBeInTheDocument()
  })
})
