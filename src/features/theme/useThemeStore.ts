import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: prefersDark() ? 'dark' : 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'thriver-theme' },
  ),
)

// Keep the <html> class in sync with the store so Tailwind's `dark:` variant applies.
const applyTheme = (theme: Theme) =>
  document.documentElement.classList.toggle('dark', theme === 'dark')

applyTheme(useThemeStore.getState().theme)
useThemeStore.subscribe((state) => applyTheme(state.theme))
