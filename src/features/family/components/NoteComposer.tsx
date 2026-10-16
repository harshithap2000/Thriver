import { useState, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'
import { Field, TextAreaField } from '@/shared/ui/Field'
import { cn } from '@/shared/utils/cn'
import { createId } from '@/shared/utils/id'

import { MAX_FROM, MAX_MESSAGE, noteColors, noteLink, stickers, type FamilyNote } from '../notes'
import { useFamilyStore } from '../useFamilyStore'
import { NoteCard } from './NoteCard'
import { ShareLink } from './ShareLink'

type Sent = { note: FamilyNote; via: 'link' | 'here' }

/** Used by family members (usually on their own phone) to write a note for the Thriver user. */
export function NoteComposer({ recipient }: { recipient: string }) {
  const addNote = useFamilyStore((s) => s.addNote)
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [sticker, setSticker] = useState<FamilyNote['sticker']>('💌')
  const [color, setColor] = useState<FamilyNote['color']>('bg-reflect')
  const [sent, setSent] = useState<Sent | null>(null)

  const buildNote = (): FamilyNote => ({
    id: createId(),
    from: from.trim(),
    message: message.trim(),
    sticker,
    color,
    sentAt: new Date().toISOString(),
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSent({ note: buildNote(), via: 'link' })
  }

  const leaveHere = () => {
    if (!from.trim() || !message.trim()) return
    const note = buildNote()
    addNote(note)
    setSent({ note, via: 'here' })
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <NoteCard note={sent.note} tilt={-1} />
        {sent.via === 'link' ? (
          <section aria-labelledby="send-note" className="bg-mint space-y-3 rounded-3xl p-5">
            <h2 id="send-note" className="text-ink font-bold">
              Now send it to {recipient}
            </h2>
            <p className="text-ink-muted text-sm">
              Your note is inside this link. When {recipient} taps it, it&rsquo;s added to their
              notes.
            </p>
            <ShareLink
              url={noteLink(sent.note)}
              title={`A note from ${sent.note.from}`}
              text={`${sent.note.sticker} ${sent.note.from} left you a note on Thriver:`}
            />
          </section>
        ) : (
          <p className="bg-mint text-ink rounded-3xl p-5 text-center font-bold" role="status">
            Saved on this phone. {recipient} will see it in their family notes 💛
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setSent(null)
            setMessage('')
          }}
          className="text-pine w-full text-sm font-semibold"
        >
          Write another note
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Write a note"
      className="space-y-4 rounded-3xl bg-white p-5 shadow-sm"
    >
      <Field
        label="Your name"
        placeholder="e.g. Mum, Grandpa, Priya"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        maxLength={MAX_FROM}
        required
      />
      <TextAreaField
        label={`Your message for ${recipient}`}
        placeholder="You've got this! Thinking of you today 💛"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_MESSAGE}
        rows={4}
        required
      />
      <p className="text-ink-muted -mt-2 text-right text-xs">
        {message.length}/{MAX_MESSAGE}
      </p>

      <fieldset>
        <legend className="text-ink mb-2 text-sm font-semibold">Sticker</legend>
        <div className="flex flex-wrap gap-2">
          {stickers.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={sticker === s}
              aria-label={`Sticker ${s}`}
              onClick={() => setSticker(s)}
              className={cn(
                'grid size-11 place-items-center rounded-xl text-2xl transition-transform hover:scale-110',
                sticker === s ? 'bg-mint ring-pine ring-2' : 'bg-cream',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-ink mb-2 text-sm font-semibold">Colour</legend>
        <div className="flex gap-3">
          {noteColors.map((c, i) => (
            <button
              key={c}
              type="button"
              aria-pressed={color === c}
              aria-label={`Colour ${i + 1}`}
              onClick={() => setColor(c)}
              className={cn(
                'size-9 rounded-full ring-offset-2 transition-transform hover:scale-110',
                c,
                color === c && 'ring-pine ring-2',
              )}
            />
          ))}
        </div>
      </fieldset>

      <div className="space-y-2 pt-1">
        <Button type="submit" className="bg-pine hover:bg-ink w-full py-3">
          Create link to send
        </Button>
        <Button variant="secondary" onClick={leaveHere} className="w-full">
          I&rsquo;m with {recipient}: leave it on this phone
        </Button>
      </div>
    </form>
  )
}
