import { SproutIcon } from '@/shared/ui/icons'

import { quoteForDate } from '../utils/dailyQuote'

export function DailyQuoteCard() {
  return (
    <figure className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#fdf3d7] to-[#e1efe1] p-5">
      <SproutIcon className="text-pine/10 absolute -right-3 -bottom-3 size-24" aria-hidden="true" />
      <figcaption className="text-pine text-xs font-bold tracking-wide uppercase">
        Today’s strength
      </figcaption>
      <blockquote className="text-ink relative mt-2 text-lg leading-snug font-semibold">
        “{quoteForDate()}”
      </blockquote>
    </figure>
  )
}
