import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { MoodId } from './moods'

/** Local calendar date as YYYY-MM-DD. */
export const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

interface MoodState {
  /** One check-in per day, keyed by date. */
  checkIns: Record<string, MoodId>
  checkIn: (mood: MoodId, date?: string) => void
  clearHistory: () => void
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      checkIns: {},
      checkIn: (mood, date = dateKey()) =>
        set((s) => ({ checkIns: { ...s.checkIns, [date]: mood } })),
      clearHistory: () => set({ checkIns: {} }),
    }),
    { name: 'thriver-mood-check-ins' },
  ),
)

export const useTodaysMood = () => useMoodStore((s) => s.checkIns[dateKey()])
