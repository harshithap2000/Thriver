import { useState } from 'react'
import { Link } from 'react-router'

import { signOut, syncNow } from '../account'
import { useSyncStore, type SyncStatus } from '../sync/useSyncStore'
import { useAuthStore, type AccountUser } from '../useAuthStore'
import { OtherAccountNotice } from './OtherAccountNotice'

const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

function statusText(status: SyncStatus, lastSyncedAt: string | null) {
  switch (status) {
    case 'syncing':
      return 'Backing up…'
    case 'offline':
      return 'Offline. Changes will back up when you’re online.'
    case 'error':
      return 'Couldn’t back up just now. Thriver will try again.'
    default:
      return lastSyncedAt
        ? `Backed up at ${time.format(new Date(lastSyncedAt))}`
        : 'Not backed up yet'
  }
}

const signedInWith = (user: AccountUser) => {
  const via = { google: 'Google', apple: 'Apple', phone: 'phone' }[user.provider ?? ''] ?? null
  const who = user.provider === 'phone' ? user.phone : (user.email ?? user.phone)
  return [via && `Signed in with ${via}`, who].filter(Boolean).join(' · ')
}

interface Props {
  /** After signing out with "remove data", reload so in-memory state is cleared. */
  reload?: (to: string) => void
}

/** Profile: account and backup status, sign in or out. Hidden when accounts aren't configured. */
export function AccountCard({ reload = (to) => window.location.replace(to) }: Props) {
  const { status, user } = useAuthStore()
  const { status: syncStatus, lastSyncedAt } = useSyncStore()
  const [confirming, setConfirming] = useState(false)
  const [removeData, setRemoveData] = useState(false)
  const [busy, setBusy] = useState(false)

  if (status === 'unconfigured' || status === 'loading') return null

  if (status === 'signedOut' || !user) {
    return (
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-ink font-bold">☁️ Back up and sync</p>
        <p className="text-ink-muted text-sm">
          Keep your data safe if you lose or change your phone, and use Thriver on more than one
          device.
        </p>
        <Link
          to="/sign-in?next=/profile"
          className="bg-pine hover:bg-ink block rounded-2xl py-3 text-center font-bold text-white"
        >
          Sign in or create an account
        </Link>
      </div>
    )
  }

  if (syncStatus === 'otherAccount') return <OtherAccountNotice reload={reload} />

  return (
    <div className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
      <div>
        <p className="text-ink font-bold">☁️ {signedInWith(user)}</p>
        <p className="text-ink-muted text-sm" aria-live="polite">
          {statusText(syncStatus, lastSyncedAt)}
        </p>
      </div>
      <p className="text-ink-muted text-xs">
        Backed up: your profile, check-ins, recovery plan, medication, appointments, activity and
        saved guides. Records, journal entries and family notes stay on this phone for now.
      </p>

      {confirming ? (
        <div
          role="alertdialog"
          aria-labelledby="sign-out-title"
          className="bg-cream space-y-3 rounded-2xl p-4"
        >
          <p id="sign-out-title" className="text-ink font-bold">
            Sign out of this phone?
          </p>
          <label className="text-ink flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={removeData}
              onChange={(e) => setRemoveData(e.target.checked)}
              className="accent-pine mt-0.5 size-5"
            />
            <span>
              Also remove my data from this phone (for shared phones). Records and journal entries
              aren’t backed up yet and will be deleted.
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-ink rounded-2xl bg-white py-3 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setBusy(true)
                void signOut({ removeLocalData: removeData }).then(() => {
                  if (removeData) reload('/welcome')
                  else {
                    setBusy(false)
                    setConfirming(false)
                  }
                })
              }}
              className="bg-move-ink rounded-2xl py-3 font-bold text-white disabled:opacity-50"
            >
              {busy ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={syncStatus === 'syncing'}
            onClick={() => void syncNow()}
            className="bg-mint text-pine rounded-2xl py-3 font-bold disabled:opacity-50"
          >
            Back up now
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-ink border-ink-muted/25 rounded-2xl border bg-white py-3 font-bold"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
