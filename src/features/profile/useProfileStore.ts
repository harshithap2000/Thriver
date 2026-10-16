import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const MAX_NAME_LENGTH = 30

interface ProfileState {
  /** Display name; empty until the user sets one. */
  name: string
  /** ISO timestamp of the first time the app stored a profile. */
  joinedAt: string
  setName: (name: string) => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      joinedAt: new Date().toISOString(),
      setName: (name) => set({ name: name.trim().slice(0, MAX_NAME_LENGTH) }),
    }),
    { name: 'thriver-profile' },
  ),
)
