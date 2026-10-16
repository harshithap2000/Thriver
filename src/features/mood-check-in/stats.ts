import { moods, type MoodId } from './moods'
import { dateKey } from './useMoodStore'

type CheckIns = Record<string, MoodId>

const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/** The last `count` days ending with `today`, oldest first. */
export function lastNDays(count: number, today = new Date()) {
  return Array.from({ length: count }, (_, i) => addDays(today, i - count + 1))
}

/**
 * Consecutive days with a check-in, ending today. If today has no check-in yet the streak
 * still counts up to yesterday, so it isn't "broken" until the day is over.
 */
export function currentStreak(checkIns: CheckIns, today = new Date()) {
  let day = checkIns[dateKey(today)] ? today : addDays(today, -1)
  let streak = 0
  while (checkIns[dateKey(day)]) {
    streak++
    day = addDays(day, -1)
  }
  return streak
}

/** The mood logged most often, or undefined with no check-ins. Ties go to the more positive mood. */
export function mostFrequentMood(checkIns: CheckIns) {
  const counts = new Map<MoodId, number>()
  for (const mood of Object.values(checkIns)) counts.set(mood, (counts.get(mood) ?? 0) + 1)

  let best: (typeof moods)[number] | undefined
  let bestCount = 0
  // `moods` is ordered most to least positive, so a strict `>` keeps the more positive on ties.
  for (const mood of moods) {
    const count = counts.get(mood.id) ?? 0
    if (count > bestCount) {
      best = mood
      bestCount = count
    }
  }
  return best
}
