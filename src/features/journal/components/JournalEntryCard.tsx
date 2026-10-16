import { useState } from 'react'

import { moods } from '@/features/mood-check-in'
import { Button } from '@/shared/ui/Button'
import { inputClass } from '@/shared/ui/Field'
import { TrashIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { useJournalStore, type JournalEntry } from '../useJournalStore'

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const updateEntry = useJournalStore((s) => s.updateEntry)
  const removeEntry = useJournalStore((s) => s.removeEntry)
  const [draft, setDraft] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const mood = moods.find((m) => m.id === entry.mood)
  const isLong = entry.body.length > 220 || entry.body.split('\n').length > 4

  return (
    <article className="space-y-2 rounded-3xl bg-white p-4 shadow-sm">
      <header className="text-ink-muted flex items-center gap-2 text-xs">
        <time dateTime={entry.createdAt}>{timeFormat.format(new Date(entry.createdAt))}</time>
        {entry.updatedAt && <span>· edited</span>}
        {mood && (
          <span className="bg-cream text-ink ml-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold">
            <span className={cn('size-2.5 rounded-full', mood.face)} aria-hidden="true" />
            {mood.label}
          </span>
        )}
      </header>

      {entry.prompt && <p className="text-ink text-sm font-bold">{entry.prompt}</p>}

      {draft === null ? (
        <>
          <p
            className={cn(
              'text-ink leading-relaxed whitespace-pre-wrap',
              isLong && !expanded && 'line-clamp-4',
            )}
          >
            {entry.body}
          </p>
          <div className="flex items-center gap-4 pt-1 text-sm font-semibold">
            {isLong && (
              <button type="button" onClick={() => setExpanded((e) => !e)} className="text-pine">
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
            <button type="button" onClick={() => setDraft(entry.body)} className="text-ink-muted">
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this journal entry?')) removeEntry(entry.id)
              }}
              aria-label="Delete entry"
              className="text-ink-muted hover:bg-move/40 hover:text-move-ink ml-auto grid size-8 place-items-center rounded-full"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateEntry(entry.id, draft.trim())
            setDraft(null)
          }}
          className="space-y-2"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Edit entry"
            rows={5}
            maxLength={5000}
            className={cn(inputClass, 'resize-y')}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.trim()} className="bg-pine hover:bg-ink">
              Save
            </Button>
          </div>
        </form>
      )}
    </article>
  )
}
