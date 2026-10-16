import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { MoodId } from '@/features/mood-check-in'
import { createId } from '@/shared/utils/id'

export interface JournalEntry {
  id: string
  /** ISO timestamp */
  createdAt: string
  updatedAt?: string
  prompt?: string
  body: string
  /** The day's mood check-in when the entry was written, if any. */
  mood?: MoodId
}

export type NewJournalEntry = Pick<JournalEntry, 'prompt' | 'body' | 'mood'>

interface JournalState {
  entries: JournalEntry[]
  addEntry: (entry: NewJournalEntry) => void
  updateEntry: (id: string, body: string) => void
  removeEntry: (id: string) => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({
          entries: [
            { ...entry, id: createId(), createdAt: new Date().toISOString() },
            ...s.entries,
          ],
        })),
      updateEntry: (id, body) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, body, updatedAt: new Date().toISOString() } : e,
          ),
        })),
      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    { name: 'thriver-journal' },
  ),
)
