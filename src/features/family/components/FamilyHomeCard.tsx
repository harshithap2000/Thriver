import { Link } from 'react-router'

import { sortNewestFirst, useFamilyStore } from '../useFamilyStore'
import { NoteCard } from './NoteCard'

/** Latest family note for the Home screen, or an invitation to get some. */
export function FamilyHomeCard() {
  const notes = useFamilyStore((s) => s.notes)
  const latest = [...notes].sort(sortNewestFirst)[0]

  return (
    <section aria-labelledby="family-home-title" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 id="family-home-title" className="text-ink font-bold">
          From your family
        </h2>
        <Link to="/family" className="text-ink-muted hover:text-ink text-sm font-semibold">
          {notes.length > 1 ? `See all ${notes.length}` : 'Open'}
        </Link>
      </div>
      {latest ? (
        <Link
          to="/family"
          aria-label={`Note from ${latest.from}: ${latest.message}`}
          className="block"
        >
          <NoteCard note={latest} tilt={-1} />
        </Link>
      ) : (
        <Link
          to="/family"
          className="flex items-center gap-4 rounded-3xl bg-linear-to-r from-[#fff3cf] to-[#fbe9ee] p-4"
        >
          <span className="text-4xl" aria-hidden="true">
            💌
          </span>
          <span>
            <span className="text-ink block font-bold">Invite family to send you notes</span>
            <span className="text-ink-muted block text-sm">Little messages for tough days</span>
          </span>
        </Link>
      )}
    </section>
  )
}
