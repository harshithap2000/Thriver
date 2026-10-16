export function PlantIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" className={className} aria-hidden="true">
      <ellipse cx="72" cy="112" rx="48" ry="5" fill="#cfe5cf" />
      {/* Back leaves */}
      <path d="M70 108 C58 84 58 52 74 30 C86 52 84 84 70 108 Z" fill="#b8d9b4" />
      <path d="M72 108 C70 80 78 50 96 34 C102 60 92 88 72 108 Z" fill="#a9cfa6" />
      {/* Front leaves */}
      <path d="M70 110 C50 106 26 92 22 70 C46 66 64 84 70 110 Z" fill="#4f9a7a" />
      <path d="M72 110 C88 98 112 92 124 72 C102 62 80 80 72 110 Z" fill="#3f8a6c" />
      <path
        d="M70 110 C66 90 54 74 44 62"
        stroke="#3a7e62"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M72 110 C78 94 92 82 106 76"
        stroke="#2f7259"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Heart */}
      <path
        d="M112 32 s-12-7-12-15 a6.5 6.5 0 0 1 12-3.5 a6.5 6.5 0 0 1 12 3.5 c0 8-12 15-12 15 Z"
        fill="#f47e6a"
      />
    </svg>
  )
}
