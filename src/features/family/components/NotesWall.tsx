import { HeartIcon, TrashIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { sortNewestFirst, useFamilyStore } from '../useFamilyStore'
import { NoteCard } from './NoteCard'

const tilts = [-1.5, 1, -0.5, 1.5, -1]

export function NotesWall() {
  const notes = useFamilyStore((s) => s.notes)
  const toggleHeart = useFamilyStore((s) => s.toggleHeart)
  const removeNote = useFamilyStore((s) => s.removeNote)

  if (notes.length === 0) {
    return (
      <div className="border-ink-muted/20 rounded-3xl border-2 border-dashed p-6 text-center">
        <p className="text-3xl" aria-hidden="true">
          💌
        </p>
        <p className="text-ink mt-2 font-semibold">No notes yet</p>
        <p className="text-ink-muted text-sm">
          Share your invite link and your family&rsquo;s messages will appear here.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-5">
      {[...notes].sort(sortNewestFirst).map((note, i) => (
        <li key={note.id}>
          <NoteCard
            note={note}
            tilt={tilts[i % tilts.length]}
            actions={
              <>
                <button
                  type="button"
                  aria-pressed={Boolean(note.hearted)}
                  aria-label={`Love note from ${note.from}`}
                  onClick={() => toggleHeart(note.id)}
                  className={cn(
                    'grid size-8 place-items-center rounded-full transition-transform hover:scale-110',
                    note.hearted ? 'text-move-ink' : 'text-ink-muted/50',
                  )}
                >
                  <HeartIcon className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete note from ${note.from}`}
                  onClick={() => {
                    if (window.confirm(`Delete this note from ${note.from}?`)) removeNote(note.id)
                  }}
                  className="text-ink-muted/60 hover:text-move-ink grid size-8 place-items-center rounded-full"
                >
                  <TrashIcon className="size-4" />
                </button>
              </>
            }
          />
        </li>
      ))}
    </ul>
  )
}
