import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { dateKey } from '@/shared/utils/date'
import { createId } from '@/shared/utils/id'

import type { ActivityKind } from './activities'

export interface Activity {
  id: string
  /** YYYY-MM-DD */
  date: string
  kind: ActivityKind
  minutes: number
  /** e.g. the routine name */
  label?: string
}

interface MoveState {
  activities: Activity[]
  /** Active minutes to aim for each day. */
  dailyGoal: number
  logActivity: (activity: Omit<Activity, 'id' | 'date'> & { date?: string }) => void
  removeActivity: (id: string) => void
  setDailyGoal: (minutes: number) => void
}

export const GOAL_OPTIONS = [10, 20, 30, 45, 60] as const

export const useMoveStore = create<MoveState>()(
  persist(
    (set) => ({
      activities: [],
      dailyGoal: 20,
      logActivity: ({ date = dateKey(), ...activity }) =>
        set((s) => ({
          activities: [
            ...s.activities,
            {
              ...activity,
              minutes: Math.max(1, Math.round(activity.minutes)),
              date,
              id: createId(),
            },
          ],
        })),
      removeActivity: (id) => set((s) => ({ activities: s.activities.filter((a) => a.id !== id) })),
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
    }),
    { name: 'thriver-move' },
  ),
)

/** Total minutes per day. */
export function minutesByDay(activities: Activity[]) {
  const totals: Record<string, number> = {}
  for (const a of activities) totals[a.date] = (totals[a.date] ?? 0) + a.minutes
  return totals
}
