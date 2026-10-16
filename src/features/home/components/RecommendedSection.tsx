import { Link } from 'react-router'

import { PlayIcon, SproutIcon } from '@/shared/ui/icons'

export function RecommendedSection() {
  return (
    <section aria-labelledby="recommended-title" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 id="recommended-title" className="text-ink font-bold">
          Recommended for you
        </h2>
        <Link to="/meditate" className="text-ink-muted hover:text-ink text-sm font-semibold">
          See all
        </Link>
      </div>
      <article className="flex items-center gap-4 rounded-3xl bg-linear-to-r from-[#fbe9ee] to-[#f1e8f8] p-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/70">
          <SproutIcon className="text-meditate-ink size-9" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-ink leading-snug font-bold">5-Minute Mindful Breathing</h3>
          <p className="text-ink-muted mt-0.5 text-sm">A quick reset for your day</p>
        </div>
        <Link
          to="/meditate?session=breathing-5"
          aria-label="Play 5-Minute Mindful Breathing"
          className="bg-sleep text-sleep-ink grid size-11 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          <PlayIcon className="ml-0.5 size-5" />
        </Link>
      </article>
    </section>
  )
}
