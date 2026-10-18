import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { cancerLabel, personalise, useProfileStore } from '@/features/profile'
import { inputClass } from '@/shared/ui/Field'
import { SearchIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { guides, topics, type TopicId } from '../guides'
import { useSavedGuides } from '../useSavedGuides'
import { GuideCard } from './GuideCard'

type Filter = TopicId | 'all' | 'saved'

/** `picks` is an optional slot (e.g. AI picks) shown under the header. */
export function LearnHub({ picks }: { picks?: ReactNode }) {
  const saved = useSavedGuides((s) => s.saved)
  const health = useProfileStore((s) => s.health)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const personalised = useMemo(() => personalise(guides, health), [health])
  const label = cancerLabel(health.cancerType)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = showAll
      ? [...personalised.items, ...personalised.hidden.map((g) => ({ ...g, forYou: false }))]
      : personalised.items
    return pool
      .filter(
        (g) =>
          filter === 'all' || (filter === 'saved' ? saved.includes(g.slug) : g.topic === filter),
      )
      .filter((g) => !q || `${g.title} ${g.summary}`.toLowerCase().includes(q))
  }, [personalised, showAll, filter, query, saved])

  const chips: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...topics.map((t) => ({ id: t.id, label: `${t.emoji} ${t.label}` })),
    { id: 'saved', label: `🔖 Saved${saved.length ? ` (${saved.length})` : ''}` },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">Learn</h1>
        <p className="text-ink-muted">
          {label ? (
            <>
              Personalised for your {label.toLowerCase()} cancer recovery ·{' '}
              <Link to="/profile/health" className="text-pine font-semibold underline">
                Change
              </Link>
            </>
          ) : (
            'Clear answers about life after cancer treatment.'
          )}
        </p>
      </header>

      {picks}

      <div className="relative">
        <SearchIcon className="text-ink-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, e.g. lymphoedema"
          aria-label="Search guides"
          className={cn(inputClass, 'pl-10')}
        />
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold',
              filter === c.id ? 'bg-pine text-white' : 'text-ink bg-white shadow-sm',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="guides-title" className="space-y-3">
        <h2 id="guides-title" className="text-ink font-bold">
          Guides
        </h2>
        {visible.length === 0 ? (
          <p className="border-ink-muted/20 text-ink-muted rounded-2xl border-2 border-dashed p-4 text-center text-sm">
            {filter === 'saved' && !query
              ? 'Guides you save will appear here.'
              : 'No guides match that yet.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {visible.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} forYou={g.forYou} />
              </li>
            ))}
          </ul>
        )}
        {personalised.hidden.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-pine hover:bg-mint w-full rounded-2xl py-3 text-sm font-semibold"
          >
            {showAll
              ? 'Show only guides for me'
              : `Show ${personalised.hidden.length} more guide${personalised.hidden.length > 1 ? 's' : ''} for other cancers`}
          </button>
        )}
      </section>

      <section aria-labelledby="voices-title" className="space-y-3">
        <h2 id="voices-title" className="text-ink font-bold">
          Voices from survivors
        </h2>
        <div className="rounded-3xl bg-linear-to-br from-[#fbe9ee] to-[#f1e8f8] p-5">
          <p className="text-2xl" aria-hidden="true">
            🎙️
          </p>
          <p className="text-ink mt-2 font-bold">Real stories, coming soon</p>
          <p className="text-ink-muted mt-1 text-sm">
            We’re gathering stories from Indian cancer survivors, in their own words and languages:
            what they wish they’d known, and what helped.
          </p>
        </div>
      </section>

      <p className="text-ink-muted text-center text-xs">
        Thriver’s guides support your care. They don’t replace your doctor’s advice.
      </p>
    </div>
  )
}
