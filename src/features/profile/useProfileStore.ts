import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { emptyHealth, type HealthProfile } from './health'

export const MAX_NAME_LENGTH = 30

interface ProfileState {
  /** Display name; empty until the user sets one. */
  name: string
  /** ISO timestamp of the first time the app stored a profile. */
  joinedAt: string
  /** True once sign-up (onboarding) has been completed or skipped. */
  onboarded: boolean
  health: HealthProfile
  /** Consent to send the (name-free) health profile to the AI for personalised picks. */
  aiPersonalise: boolean
  /** When AI consent was last given (ISO), for the consent record. */
  aiConsentAt: string | null
  setName: (name: string) => void
  setHealth: (health: HealthProfile) => void
  setAiPersonalise: (enabled: boolean) => void
  completeOnboarding: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      joinedAt: new Date().toISOString(),
      onboarded: false,
      health: emptyHealth,
      aiPersonalise: false,
      aiConsentAt: null,
      setName: (name) => set({ name: name.trim().slice(0, MAX_NAME_LENGTH) }),
      setHealth: (health) => set({ health }),
      setAiPersonalise: (enabled) =>
        set({ aiPersonalise: enabled, aiConsentAt: enabled ? new Date().toISOString() : null }),
      completeOnboarding: () => set({ onboarded: true }),
    }),
    { name: 'thriver-profile' },
  ),
)
