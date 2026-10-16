import { useMemo, useState } from 'react'

import { inputClass } from '@/shared/ui/Field'
import { SearchIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'
import { addDays, dateKey, parseDateKey } from '@/shared/utils/date'

import { useJournalStore } from '../useJournalStore'
import { JournalEntryCard } from './JournalEntryCard'

const dayTitle = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

function labelFor(key: string) {
  if (key === dateKey()) return 'Today'
  if (key === dateKey(addDays(new Date(), -1))) return 'Yesterday'
  return dayTitle.format(parseDateKey(key))
}

export function JournalEntries() {
  const entries = useJournalStore((s) => s.entries)
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matching = q
      ? entries.filter((e) => `${e.prompt ?? ''} ${e.body}`.toLowerCase().includes(q))
      : entries
    const byDay = new Map<string, typeof entries>()
    for (const entry of [...matching].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      const key = dateKey(new Date(entry.createdAt))
      byDay.set(key, [...(byDay.get(key) ?? []), entry])
    }
    return [...byDay]
  }, [entries, query])

  if (entries.length === 0) {
    return (
      <p className="border-ink-muted/20 text-ink-muted rounded-2xl border-2 border-dashed p-4 text-center text-sm">
        Your entries will appear here.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <SearchIcon className="text-ink-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entries"
          aria-label="Search entries"
          className={cn(inputClass, 'pl-10')}
        />
      </div>

      {groups.length === 0 && (
        <p className="text-ink-muted text-center text-sm">No entries match “{query}”.</p>
      )}

      {groups.map(([key, dayEntries]) => (
        <section key={key} aria-label={labelFor(key)} className="space-y-3">
          <h3 className="text-ink-muted text-sm font-bold">{labelFor(key)}</h3>
          {dayEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      ))}
    </div>
  )
}
