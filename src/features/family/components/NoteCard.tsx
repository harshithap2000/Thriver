import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

import type { FamilyNote } from '../notes'

const sentFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

interface NoteCardProps {
  note: FamilyNote
  /** Slight rotation for a pinned-note look. */
  tilt?: number
  actions?: ReactNode
}

export function NoteCard({ note, tilt = 0, actions }: NoteCardProps) {
  return (
    <figure
      className={cn('relative rounded-3xl p-5 pt-6 shadow-sm', note.color)}
      style={{ rotate: `${tilt}deg` }}
    >
      <span className="absolute -top-3 right-5 text-3xl drop-shadow-sm" aria-hidden="true">
        {note.sticker}
      </span>
      <blockquote className="text-ink text-lg leading-snug font-semibold whitespace-pre-wrap">
        {note.message}
      </blockquote>
      <figcaption className="text-ink-muted mt-3 flex items-center gap-2 text-sm">
        <span className="text-ink font-bold">— {note.from}</span>
        <span>· {sentFormat.format(new Date(note.sentAt))}</span>
        {actions && <span className="ml-auto flex items-center gap-1">{actions}</span>}
      </figcaption>
    </figure>
  )
}
