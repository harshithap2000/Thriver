import { useState, type FormEvent } from 'react'

import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'

import { MAX_NAME_LENGTH, useProfileStore } from '../useProfileStore'

const monthYear = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })

export function ProfileHeader() {
  const name = useProfileStore((s) => s.name)
  const joinedAt = useProfileStore((s) => s.joinedAt)
  const setName = useProfileStore((s) => s.setName)
  const [draft, setDraft] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setName(draft ?? '')
    setDraft(null)
  }

  return (
    <header className="flex flex-col items-center text-center">
      <Avatar className="size-24" />

      {draft === null ? (
        <>
          <h1 className="text-ink mt-3 text-2xl font-extrabold">{name || 'Welcome, friend'}</h1>
          <p className="text-ink-muted text-sm">
            Thriving since {monthYear.format(new Date(joinedAt))}
          </p>
          <button
            type="button"
            onClick={() => setDraft(name)}
            className="text-pine hover:bg-mint mt-3 rounded-full bg-white px-4 py-1.5 text-sm font-semibold shadow-sm"
          >
            {name ? 'Edit name' : 'Add your name'}
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex w-full max-w-xs flex-col gap-3">
          <label htmlFor="profile-name" className="text-ink text-sm font-semibold">
            What should we call you?
          </label>
          <input
            id="profile-name"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="given-name"
            // The field appears in response to the user's own click, so moving focus is expected.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="border-ink-muted/30 text-ink focus:border-pine focus:ring-pine/20 rounded-xl border bg-white px-4 py-2.5 text-center outline-none focus:ring-2"
          />
          <div className="flex justify-center gap-2">
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-pine hover:bg-ink">
              Save
            </Button>
          </div>
        </form>
      )}
    </header>
  )
}
