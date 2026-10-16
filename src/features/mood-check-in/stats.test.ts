import { currentStreak, lastNDays, mostFrequentMood } from './stats'
import { dateKey } from '@/shared/utils/date'

const today = new Date(2026, 9, 16) // 16 Oct 2026
const daysAgo = (n: number) => dateKey(new Date(2026, 9, 16 - n))

describe('lastNDays', () => {
  it('returns the last n days ending today, oldest first', () => {
    expect(lastNDays(3, today).map((d) => dateKey(d))).toEqual([
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
    ])
  })

  it('crosses month boundaries', () => {
    expect(dateKey(lastNDays(20, today)[0])).toBe('2026-09-27')
  })
})

describe('currentStreak', () => {
  it('is 0 with no check-ins', () => {
    expect(currentStreak({}, today)).toBe(0)
  })

  it('counts consecutive days ending today', () => {
    const checkIns = { [daysAgo(0)]: 'good', [daysAgo(1)]: 'okay', [daysAgo(2)]: 'great' } as const
    expect(currentStreak(checkIns, today)).toBe(3)
  })

  it("still counts up to yesterday when today isn't logged yet", () => {
    const checkIns = { [daysAgo(1)]: 'okay', [daysAgo(2)]: 'great' } as const
    expect(currentStreak(checkIns, today)).toBe(2)
  })

  it('stops at the first gap', () => {
    const checkIns = { [daysAgo(0)]: 'good', [daysAgo(2)]: 'great' } as const
    expect(currentStreak(checkIns, today)).toBe(1)
  })
})

describe('mostFrequentMood', () => {
  it('is undefined with no check-ins', () => {
    expect(mostFrequentMood({})).toBeUndefined()
  })

  it('returns the most logged mood, preferring the more positive one on ties', () => {
    expect(mostFrequentMood({ a: 'tired', b: 'tired', c: 'good' })?.id).toBe('tired')
    expect(mostFrequentMood({ a: 'tired', b: 'good' })?.id).toBe('good')
  })
})
