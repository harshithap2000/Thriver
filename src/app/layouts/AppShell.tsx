import type { ComponentType, SVGProps } from 'react'
import { NavLink, Outlet } from 'react-router'

import { HomeIcon, JournalIcon, ProfileIcon, SearchIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

const tabs: Array<{ to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/explore', label: 'Explore', Icon: SearchIcon },
  { to: '/journal', label: 'Journal', Icon: JournalIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

/** Mobile-first app frame: scrollable content with a fixed bottom tab bar. */
export function AppShell() {
  return (
    <div className="bg-cream text-ink min-h-dvh font-sans">
      <main className="mx-auto max-w-md px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-28">
        <Outlet />
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md rounded-t-3xl bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(35,68,63,0.08)] backdrop-blur"
      >
        <ul className="grid grid-cols-4">
          {tabs.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 py-3 text-xs transition-colors',
                    isActive ? 'text-pine font-bold' : 'text-ink-muted hover:text-ink font-medium',
                  )
                }
              >
                <Icon className="size-6" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
