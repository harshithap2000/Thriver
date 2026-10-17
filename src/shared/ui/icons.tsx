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

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...stroked} strokeWidth={2.5} {...props}>
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  )
}

export function PillIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <g transform="rotate(-45 12 12)">
        <rect x="3" y="8" width="18" height="8" rx="4" />
        <path d="M12 8H7a4 4 0 0 0 0 8h5Z" fill="currentColor" />
      </g>
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...stroked} strokeWidth={2.5} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...stroked} strokeWidth={3} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

export function PuzzleIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M10 3.5a2.25 2.25 0 0 1 4.5 0V5H18a1 1 0 0 1 1 1v3.5h1.5a2.25 2.25 0 0 1 0 4.5H19V19a1 1 0 0 1-1 1h-4v-1.5a2 2 0 0 0-4 0V20H6a1 1 0 0 1-1-1v-4h1.5a2 2 0 0 0 0-4H5V6a1 1 0 0 1 1-1h4Z" />
    </svg>
  )
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  )
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />
      <path d="M8 13h8" />
    </svg>
  )
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M10 3.5 11.6 8a3 3 0 0 0 1.9 1.9L18 11.5l-4.5 1.6a3 3 0 0 0-1.9 1.9L10 19.5 8.4 15a3 3 0 0 0-1.9-1.9L2 11.5 6.5 9.9A3 3 0 0 0 8.4 8Z" />
      <path d="m18.5 2.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
    </svg>
  )
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M3.4 20.4 21 12 3.4 3.6a.7.7 0 0 0-1 .8L4.6 11H13v2H4.6l-2.2 6.6a.7.7 0 0 0 1 .8Z" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
    </svg>
  )
}

export function CareIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M12 20.5s-8.5-5-8.5-11A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 2.9c0 6-8.5 11-8.5 11Z" />
      <path d="M7 12h2.5l1.5-2.5 2 5 1.5-2.5H17" />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" />
      <path d="M12 6.5V20" />
    </svg>
  )
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg {...stroked} {...props}>
      <path d="M6 4h12v16.5l-6-4-6 4Z" />
    </svg>
  )
}
