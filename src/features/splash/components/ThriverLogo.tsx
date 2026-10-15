/** White rounded cross with two leaf outlines: the Thriver mark. */
export function ThriverLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="white">
        <rect x="32" y="0" width="36" height="100" rx="18" />
        <rect x="0" y="32" width="100" height="36" rx="18" />
      </g>
      <g
        fill="none"
        stroke="var(--color-splash-bg)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Upper leaf */}
        <path d="M54 54 C40 42 44 20 63 8 C68 28 66 44 54 54 Z" />
        <path d="M54 54 Q58 32 63 8" />
        {/* Left leaf */}
        <path d="M54 54 C42 40 22 40 8 47 C22 59 42 61 54 54 Z" />
        <path d="M54 54 Q30 47 8 47" />
        {/* Stem */}
        <path d="M54 54 C60 60 63 65 66 71" />
      </g>
    </svg>
  )
}
