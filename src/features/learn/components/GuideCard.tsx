import { Link } from 'react-router'

import { cn } from '@/shared/utils/cn'

import { topicInfo, type Guide } from '../guides'

export function GuideCard({ guide, forYou = false }: { guide: Guide; forYou?: boolean }) {
  const topic = topicInfo(guide.topic)
  return (
    <Link
      to={`/learn/${guide.slug}`}
      className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <span
        className={cn('grid size-12 shrink-0 place-items-center rounded-2xl text-2xl', topic.tile)}
        aria-hidden="true"
      >
        {topic.emoji}
      </span>
      <span className="min-w-0 flex-1">
        {forYou && (
          <span className="bg-mint text-pine mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold">
            For you
          </span>
        )}
        <span className="text-ink block leading-snug font-bold">{guide.title}</span>
        <span className="text-ink-muted block text-sm">
          {guide.minutes} min read · {topic.label}
        </span>
      </span>
    </Link>
  )
}
