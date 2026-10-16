import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { dateKey } from '@/shared/utils/date'

import type { MoodId } from './moods'

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
