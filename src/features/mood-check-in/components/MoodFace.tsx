import type { Mouth } from '../moods'

const mouths: Record<Mouth, string> = {
  smile: 'M15 27 Q20 32 25 27',
  flat: 'M15.5 28 H24.5',
  frown: 'M15 30 Q20 25 25 30',
}

export function MoodFace({ mouth }: { mouth: Mouth }) {
  return (
    <svg viewBox="0 0 40 40" className="size-full" aria-hidden="true">
      <g stroke="#3b4f49" strokeWidth="2" strokeLinecap="round" fill="none">
        {mouth === 'frown' ? (
          <path d="M13 18.5 L16.5 16.5 M27 18.5 L23.5 16.5" />
        ) : (
          <>
            <circle cx="15" cy="18" r="0.8" fill="#3b4f49" />
            <circle cx="25" cy="18" r="0.8" fill="#3b4f49" />
          </>
        )}
        <path d={mouths[mouth]} />
      </g>
    </svg>
  )
}
