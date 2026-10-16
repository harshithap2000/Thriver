import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompletedSession {
  sessionId: string
  minutes: number
  /** ISO timestamp */
  completedAt: string
}

interface MeditationState {
  history: CompletedSession[]
  logSession: (sessionId: string, minutes: number) => void
}

export const useMeditationStore = create<MeditationState>()(
  persist(
    (set) => ({
      history: [],
      logSession: (sessionId, minutes) =>
        set((s) => ({
          history: [...s.history, { sessionId, minutes, completedAt: new Date().toISOString() }],
        })),
    }),
    { name: 'thriver-meditation' },
  ),
)
