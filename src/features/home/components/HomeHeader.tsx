import { NavLink } from 'react-router'

import { SproutIcon } from '@/shared/ui/icons'

import { getGreeting } from '../utils/greeting'
import { Avatar } from './Avatar'

export function HomeHeader() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <p className="text-ink-muted">{getGreeting()},</p>
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
