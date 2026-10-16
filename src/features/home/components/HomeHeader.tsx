import { NavLink } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { Avatar } from '@/shared/ui/Avatar'
import { SproutIcon } from '@/shared/ui/icons'

import { getGreeting } from '../utils/greeting'

export function HomeHeader() {
  const name = useProfileStore((s) => s.name)

  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className="text-ink-muted">{name ? `${getGreeting()}, ${name}` : `${getGreeting()},`}</p>
        <h1 className="text-ink mt-0.5 flex items-center gap-2 text-[1.75rem] leading-tight font-extrabold">
          You&rsquo;ve got this
          <SproutIcon className="text-pine size-6" />
        </h1>
      </div>
      <NavLink to="/profile" aria-label="Your profile" className="shrink-0 rounded-full">
        <Avatar className="size-12" />
      </NavLink>
    </header>
  )
}
