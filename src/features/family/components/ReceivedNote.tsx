import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/shared/ui/Button'

import { decodeNote } from '../notes'
import { useFamilyStore } from '../useFamilyStore'
import { NoteCard } from './NoteCard'

/** Shown when the user opens a note link sent by a family member. */
export function ReceivedNote({ payload }: { payload: string }) {
  const addNote = useFamilyStore((s) => s.addNote)
  const note = decodeNote(payload)
  const alreadySaved = useFamilyStore((s) => s.notes.some((n) => n.id === note?.id))
  const [justSaved, setJustSaved] = useState(false)

  if (!note) {
    return (
      <div className="bg-move/50 space-y-3 rounded-3xl p-6 text-center" role="alert">
        <p className="text-ink font-bold">This note link didn&rsquo;t work</p>
        <p className="text-ink-muted text-sm">
          It may have been cut off when it was copied. Ask them to send it again.
        </p>
        <Link to="/family" className="text-pine inline-block font-semibold underline">
          Go to family notes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-ink text-center text-lg font-bold">
        {note.sticker} {note.from} sent you a note!
      </p>
      <NoteCard note={note} tilt={-1} />
      {alreadySaved ? (
        <div className="space-y-3 text-center">
          <p className="text-pine font-semibold" role="status">
            {justSaved ? 'Saved to your family notes 💛' : 'This note is already in your notes.'}
          </p>
          <Link
            to="/family"
            className="bg-pine hover:bg-ink inline-block rounded-full px-5 py-2.5 font-bold text-white"
          >
            See all notes
          </Link>
        </div>
      ) : (
        <Button
          onClick={() => setJustSaved(addNote(note))}
          className="bg-pine hover:bg-ink w-full py-3"
        >
          Save to my notes
        </Button>
      )}
    </div>
  )
}
