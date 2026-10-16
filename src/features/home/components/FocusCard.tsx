import { Link } from 'react-router'

import { ChevronRightIcon } from '@/shared/ui/icons'

import { PlantIllustration } from './PlantIllustration'

export function FocusCard() {
  return (
    <section
      aria-labelledby="focus-title"
      className="bg-mint relative flex min-h-40 overflow-hidden rounded-3xl p-5"
    >
      <div className="relative z-10 flex flex-col">
        <p className="text-ink-muted text-sm">Today&rsquo;s focus</p>
        <h2 id="focus-title" className="text-ink mt-1 text-xl leading-snug font-bold">
          A calmer mind
          <br />
          brighter days
        </h2>
        <Link
          to="/explore?category=meditate"
          aria-label="Start today's focus"
          className="text-ink mt-auto grid size-10 place-items-center rounded-full bg-white shadow-sm transition-transform hover:translate-x-0.5"
        >
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>
      <PlantIllustration className="absolute right-2 bottom-1 w-40" />
    </section>
  )
}
