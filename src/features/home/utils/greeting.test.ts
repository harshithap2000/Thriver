import { getGreeting } from './greeting'

const at = (hour: number) => new Date(2026, 0, 1, hour)

describe('getGreeting', () => {
  it.each([
    [5, 'Good morning'],
    [11, 'Good morning'],
    [12, 'Good afternoon'],
    [16, 'Good afternoon'],
    [17, 'Good evening'],
    [2, 'Good evening'],
  ])('at %i:00 says "%s"', (hour, expected) => {
    expect(getGreeting(at(hour))).toBe(expected)
  })
})
