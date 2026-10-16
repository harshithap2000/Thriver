import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
} as const

const stroked = {
  ...base,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function SproutIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M11 21v-7.5C11 9 7.5 6 3 6c0 4.6 3.4 8 8 7.5Z" />
      <path d="M12.6 21v-6.2c0-4.3 3.4-7.6 8.4-7.8 0 4.7-3.6 8.4-8.4 8" />
      <rect x="11" y="13" width="1.8" height="8" rx="0.9" />
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M12 20.5s-8.5-5-8.5-11A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 2.9c0 6-8.5 11-8.5 11Z" />
    </svg>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M20 14.6A8.5 8.5 0 0 1 9.4 4a8.5 8.5 0 1 0 10.6 10.6Z" />
    </svg>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="4.5" stroke="none" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
      />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M3 10.6 12 3l9 7.6V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function JournalIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <rect x="4.5" y="3" width="15" height="18" rx="2" />
      <path d="M8.5 7.5h7M8.5 11.5h4" />
    </svg>
  )
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5c1.3-2 3.2-3 5.5-3s4.2 1 5.5 3" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...stroked} strokeWidth={2.5} {...props}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}
