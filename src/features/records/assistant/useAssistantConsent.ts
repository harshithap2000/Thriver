import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConsentState {
  consented: boolean
  /** When consent was given (ISO), for the consent record in the privacy centre. */
  consentedAt: string | null
  language: 'en' | 'hi'
  setConsented: (value: boolean) => void
  setLanguage: (language: 'en' | 'hi') => void
}

/** Whether the user has agreed to send questions and opened records to the AI service. */
export const useAssistantConsent = create<ConsentState>()(
  persist(
    (set) => ({
      consented: false,
      consentedAt: null,
      language: 'en',
      setConsented: (consented) =>
        set({ consented, consentedAt: consented ? new Date().toISOString() : null }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'thriver-assistant-consent' },
  ),
)
