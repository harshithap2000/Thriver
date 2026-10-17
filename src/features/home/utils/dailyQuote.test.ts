import { quoteForDate, quotes } from './dailyQuote'

describe('daily quote', () => {
  it('stays the same all day and changes the next day', () => {
    const morning = new Date(2026, 9, 17, 7, 0)
    const night = new Date(2026, 9, 17, 23, 30)
    const tomorrow = new Date(2026, 9, 18, 7, 0)

    expect(quoteForDate(morning)).toBe(quoteForDate(night))
    expect(quoteForDate(tomorrow)).not.toBe(quoteForDate(morning))
  })

  it('cycles through every quote before repeating', () => {
    const start = new Date(2026, 0, 1)
    const seen = new Set(
      quotes.map((_, i) => quoteForDate(new Date(start.getFullYear(), 0, 1 + i))),
    )
    expect(seen.size).toBe(quotes.length)
    expect(new Set(quotes).size).toBe(quotes.length)
  })
})
