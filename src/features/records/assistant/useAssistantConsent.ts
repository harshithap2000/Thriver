import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConsentState {
  consented: boolean
  setConsented: (value: boolean) => void
}

/** Whether the user has agreed to send questions and opened records to the AI service. */
export const useAssistantConsent = create<ConsentState>()(
  persist((set) => ({ consented: false, setConsented: (consented) => set({ consented }) }), {
    name: 'thriver-assistant-consent',
  }),
)
