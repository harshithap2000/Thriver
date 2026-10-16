import { render, screen } from '@testing-library/react'

import { games } from '../games'
import { GamesHub } from './GamesHub'

describe('GamesHub', () => {
  it('links every game to New York Times Games in a new, isolated tab', () => {
    render(<GamesHub />)

    const wordle = screen.getByRole('link', { name: /^Wordle:/ })
    expect(wordle).toHaveAttribute('href', 'https://www.nytimes.com/games/wordle/index.html')

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(games.length + 1) // each game + "Browse all"
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/www\.nytimes\.com\//)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('marks free games', () => {
    render(<GamesHub />)
    expect(screen.getAllByText('Free')).toHaveLength(games.filter((g) => g.free).length)
  })
})
