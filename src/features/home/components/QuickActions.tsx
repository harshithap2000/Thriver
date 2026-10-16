import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router'

import { HeartIcon, MoonIcon, SproutIcon, SunIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

interface Action {
  label: string
  to: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  tile: string
  ink: string
}

const actions: Action[] = [
  {
    label: 'Meditate',
    to: '/meditate',
    Icon: SproutIcon,
    tile: 'bg-meditate',
    ink: 'text-meditate-ink',
  },
  {
    label: 'Move',
    to: '/activities?category=move',
    Icon: HeartIcon,
    tile: 'bg-move',
    ink: 'text-move-ink',
  },
  {
    label: 'Sleep',
    to: '/activities?category=sleep',
    Icon: MoonIcon,
    tile: 'bg-sleep',
    ink: 'text-sleep-ink',
  },
  {
    label: 'Reflect',
    to: '/journal',
    Icon: SunIcon,
    tile: 'bg-reflect',
    ink: 'text-reflect-ink',
  },
]

export function QuickActions() {
  return (
    <nav aria-label="Activities">
      <ul className="grid grid-cols-4 gap-3">
        {actions.map(({ label, to, Icon, tile, ink }) => (
          <li key={label}>
            <Link to={to} className="group flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'grid aspect-square w-full place-items-center rounded-2xl transition-transform group-hover:-translate-y-0.5 group-active:scale-95',
                  tile,
                )}
              >
                <Icon className={cn('size-8', ink)} />
              </span>
              <span className="text-ink text-xs font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
