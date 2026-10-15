const OUTLINE = '#3a3a3a'

/** A chick in a blue helmet riding a yellow scooter, with animated exhaust puffs. */
export function ScooterChick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 165" className={className} aria-hidden="true">
      {/* Exhaust puffs drift away from the tailpipe */}
      <g fill="#f6f6f6" stroke="#b5b5b5" strokeWidth="2.5" strokeLinejoin="round">
        <path
          className="origin-center [transform-box:fill-box] motion-safe:animate-[splash-puff_1.6s_ease-out_infinite]"
          d="M150 100 q2-7 9-5 q4-6 10-1 q7 1 5 8 q4 6-3 9 q-2 7-9 4 q-6 4-9-2 q-7-2-3-8 q-4-3 0-5 Z"
        />
        <path
          className="origin-center [transform-box:fill-box] motion-safe:animate-[splash-puff_1.6s_ease-out_0.8s_infinite]"
          d="M171 79 q1-5 6-4 q3-4 7 0 q5 1 3 6 q3 4-2 6 q-1 5-6 3 q-4 3-6-2 q-5-1-2-5 q-3-2 0-4 Z"
        />
      </g>

      <g
        className="motion-safe:animate-[splash-bob_0.5s_ease-in-out_infinite_alternate]"
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Wheels */}
        <g>
          <circle cx="30" cy="135" r="15" fill="#5a5a5a" />
          <circle cx="30" cy="135" r="7" fill="#e6e6e6" />
          <circle cx="120" cy="140" r="15" fill="#5a5a5a" />
          <circle cx="120" cy="140" r="7" fill="#e6e6e6" />
        </g>

        {/* Rear body with stripes and tail light */}
        <path
          d="M78 112 C92 102 128 100 138 106 C142 112 140 128 134 132 L100 134 C96 124 86 118 78 120 Z"
          fill="#faf7a6"
        />
        <path d="M108 118 H134 M110 123 H134 M112 128 H133" stroke="#e8d84a" strokeWidth="1.8" />
        <rect x="136" y="104" width="6" height="11" rx="2" fill="#e05a4f" />

        {/* Floorboard */}
        <path d="M44 124 C60 128 84 128 100 132 L100 136 C80 136 56 134 44 130 Z" fill="#f7e41f" />

        {/* Front leg shield and fork */}
        <path d="M47 72 L57 72 C55 92 60 106 76 120 L46 128 C36 112 38 88 47 72 Z" fill="#f7e41f" />
        {/* Front fender */}
        <path d="M14 128 C16 114 40 110 50 124 L46 130 C38 122 24 122 18 130 Z" fill="#faf7a6" />

        {/* Headlight and handlebar */}
        <rect x="35" y="68" width="10" height="13" rx="3" fill="#f2f2f2" />
        <path d="M44 72 L62 70" />

        {/* Seat */}
        <path d="M66 104 C80 96 124 96 132 104 C130 110 76 112 66 104 Z" fill="#4a4a4a" />

        {/* Chick body */}
        <path
          d="M60 46 C50 66 56 92 72 103 C90 112 122 109 132 96 C142 82 134 62 112 58 C104 44 76 36 60 46 Z"
          fill="#fdffd2"
        />
        {/* Wing gripping the handlebar */}
        <path d="M74 70 C64 70 58 74 60 79 C64 84 72 82 78 78" fill="#fdffd2" />
        {/* Foot */}
        <ellipse cx="74" cy="103" rx="7" ry="5" fill="#f4a63a" />
        {/* Beak and eye */}
        <path d="M59 55 L47 59.5 L59 65 Z" fill="#f4a63a" />
        <circle cx="67" cy="51" r="1.8" fill={OUTLINE} stroke="none" />

        {/* Helmet */}
        <path
          d="M60 44 C56 18 84 4 106 12 C122 18 126 36 120 50 C102 42 80 40 60 44 Z"
          fill="#8fdced"
        />
        <path d="M58 37 C80 32 104 34 123 42" fill="none" strokeWidth="5" />
        <circle cx="60" cy="36" r="5.5" fill="#ffffff" />
      </g>
    </svg>
  )
}
