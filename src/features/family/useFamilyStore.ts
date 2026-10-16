import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { FamilyNote } from './notes'

export interface SavedNote extends FamilyNote {
  hearted?: boolean
}

interface FamilyState {
  notes: SavedNote[]
  /** Adds a note; returns false if it was already saved (e.g. the same link opened twice). */
  addNote: (note: FamilyNote) => boolean
  removeNote: (id: string) => void
  toggleHeart: (id: string) => void
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (note) => {
        if (get().notes.some((n) => n.id === note.id)) return false
        set((s) => ({ notes: [note, ...s.notes] }))
        return true
      },
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      toggleHeart: (id) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, hearted: !n.hearted } : n)),
        })),
    }),
    { name: 'thriver-family-notes' },
  ),
)

export const sortNewestFirst = (a: FamilyNote, b: FamilyNote) => b.sentAt.localeCompare(a.sentAt)
