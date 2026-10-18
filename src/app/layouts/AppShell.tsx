import type { ComponentType, SVGProps } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router'

import { useProfileStore } from '@/features/profile'

import { BookIcon, CareIcon, FolderIcon, HomeIcon, ProfileIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

const tabs: Array<{ to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/care', label: 'Care', Icon: CareIcon },
  { to: '/learn', label: 'Learn', Icon: BookIcon },
  { to: '/records', label: 'Records', Icon: FolderIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

/** Mobile-first app frame: scrollable content with a fixed bottom tab bar. */
export function AppShell() {
  const { pathname } = useLocation()
  const onboarded = useProfileStore((s) => s.onboarded)
  // Pages without the app navigation: sign-up, and family members writing or opening a note.
  const isGuestPage = ['/welcome', '/family/write', '/family/note'].includes(pathname)

  if (!onboarded && !isGuestPage) return <Navigate to="/welcome" replace />

  return (
    <div className="bg-cream text-ink min-h-dvh font-sans">
      <main
        className={cn(
          'mx-auto max-w-md px-5 pt-[max(1.5rem,env(safe-area-inset-top))]',
          isGuestPage ? 'pb-10' : 'pb-28',
        )}
      >
        <Outlet />
      </main>

      {!isGuestPage && (
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md rounded-t-3xl bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(35,68,63,0.08)] backdrop-blur"
        >
          <ul className="grid grid-cols-5">
            {tabs.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-1 py-3 text-xs transition-colors',
                      isActive
                        ? 'text-pine font-bold'
                        : 'text-ink-muted hover:text-ink font-medium',
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
      )}
    </div>
  )
}
