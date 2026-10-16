/** Placeholder illustrated avatar until users can upload a photo. */
export function Avatar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#cfe9dc" />
      <path d="M10 46c1.5-8 7-12 14-12s12.5 4 14 12a24 24 0 0 1-28 0Z" fill="#f6dcc2" />
      <circle cx="24" cy="23" r="9" fill="#fbe3cd" />
      <path
        d="M14.5 24c-1-8 4-13 9.5-13s10.5 4.5 9.5 13c-2-4-5-6.5-9.5-6.5S16.5 20 14.5 24Z"
        fill="#2f7d63"
      />
      <path
        d="M20.5 26.5q1 1 2 0M25.5 26.5q1 1 2 0"
        stroke="#7a5a44"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
