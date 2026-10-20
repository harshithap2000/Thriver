import { useState } from 'react'

import { signOut, wipeLocalData } from '../account'

interface Props {
  /** After clearing, reload so the backup is restored into a clean app. */
  reload?: (to: string) => void
}

/**
 * Shown when someone signs in on a phone that holds another account's data. Their data is never
 * mixed: the person chooses to clear this phone, or signs out again.
 */
export function OtherAccountNotice({ reload = (to) => window.location.replace(to) }: Props) {
  const [busy, setBusy] = useState(false)

  return (
    <section role="alertdialog" aria-labelledby="other-title" className="space-y-4 py-6">
      <p className="text-5xl" aria-hidden="true">
        📱
      </p>
      <h1 id="other-title" className="text-ink text-2xl font-extrabold">
        This phone has someone else’s Thriver data
      </h1>
      <p className="text-ink-muted text-lg">
        It belongs to a different account, so Thriver won’t mix it with yours. To use your account
        here, remove it from this phone first. It stays in their backup, but anything they haven’t
        backed up (like records and journal entries) will be lost from this phone.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true)
          void wipeLocalData({ keepSession: true }).then(() => reload('/'))
        }}
        className="bg-move-ink w-full rounded-2xl py-4 text-lg font-bold text-white disabled:opacity-50"
      >
        Remove it and use my account
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true)
          void signOut().then(() => reload('/'))
        }}
        className="text-ink border-ink-muted/25 w-full rounded-2xl border bg-white py-4 text-lg font-bold"
      >
        Sign out instead
      </button>
    </section>
  )
}
