import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SavedState {
  saved: string[]
  toggleSaved: (slug: string) => void
}

export const useSavedGuides = create<SavedState>()(
  persist(
    (set) => ({
      saved: [],
      toggleSaved: (slug) =>
        set((s) => ({
          saved: s.saved.includes(slug) ? s.saved.filter((x) => x !== slug) : [...s.saved, slug],
        })),
    }),
    { name: 'thriver-learn-saved' },
  ),
)
