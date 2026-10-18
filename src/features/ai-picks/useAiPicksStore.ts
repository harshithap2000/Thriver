import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Picks } from './candidates'

interface AiPicksState {
  /** Fingerprint of the profile + catalogue the cached picks were made for. */
  key: string | null
  picks: Picks | null
  save: (key: string, picks: Picks) => void
  clear: () => void
}

export const useAiPicksStore = create<AiPicksState>()(
  persist(
    (set) => ({
      key: null,
      picks: null,
      save: (key, picks) => set({ key, picks }),
      clear: () => set({ key: null, picks: null }),
    }),
    { name: 'thriver-ai-picks' },
  ),
)
