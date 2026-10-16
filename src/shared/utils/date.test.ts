import { addDays, dateKey, formatTime, monthGrid, parseDateKey } from './date'

describe('date utils', () => {
  it('round-trips date keys in local time', () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(parseDateKey('2026-01-05')).toEqual(new Date(2026, 0, 5))
  })

  it('adds days across month and year boundaries', () => {
    expect(dateKey(addDays(new Date(2026, 11, 31), 1))).toBe('2027-01-01')
    expect(dateKey(addDays(new Date(2026, 2, 1), -1))).toBe('2026-02-28')
  })

  it('formats 24h times', () => {
    expect(formatTime('08:05')).toMatch(/8:05/)
    expect(formatTime('20:30')).toMatch(/(8:30|20:30)/)
  })

  it('builds a Sunday-first month grid of whole weeks', () => {
    // October 2026 starts on a Thursday and has 31 days → 5 weeks.
    const grid = monthGrid(2026, 9)
    expect(grid).toHaveLength(35)
    expect(dateKey(grid[0])).toBe('2026-09-27')
    expect(dateKey(grid.at(-1))).toBe('2026-10-31')
    expect(grid.every((d, i) => d.getDay() === i % 7)).toBe(true)
  })
})
