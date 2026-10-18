import { useState } from 'react'
import { Link } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { useAssistantConsent } from '@/features/records'
import { ChevronLeftIcon, DownloadIcon } from '@/shared/ui/icons'

import { deleteEverything, downloadAllData } from '../dataTools'

const agreedOn = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

interface Props {
  /** After deleting: start again from sign-up (a full reload clears in-memory state). */
  onDeleted?: () => void
}

/** What Thriver stores and shares, consents with withdraw, export and delete. */
export function PrivacyCentre({ onDeleted = () => window.location.replace('/welcome') }: Props) {
  const assistant = useAssistantConsent()
  const { aiPersonalise, aiConsentAt, setAiPersonalise } = useProfileStore()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState<'' | 'export' | 'delete'>('')
  const [error, setError] = useState('')

  const consents = [
    assistant.consented && {
      label: 'Records assistant',
      at: assistant.consentedAt,
      withdraw: () => assistant.setConsented(false),
    },
    aiPersonalise && {
      label: 'AI picks in Learn and Shop',
      at: aiConsentAt,
      withdraw: () => setAiPersonalise(false),
    },
  ].filter((c) => c !== false)

  const run = async (kind: 'export' | 'delete') => {
    setBusy(kind)
    setError('')
    try {
      if (kind === 'export') await downloadAllData()
      else {
        await deleteEverything()
        onDeleted()
      }
    } catch {
      setError(kind === 'export' ? 'Couldn’t prepare your data.' : 'Couldn’t delete everything.')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="space-y-5">
      <Link
        to="/profile"
        className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
      >
        <ChevronLeftIcon className="size-4" /> Profile
      </Link>
      <header>
        <h1 className="text-ink text-[1.75rem] font-extrabold">Your privacy</h1>
        <p className="text-ink-muted">Your health data belongs to you.</p>
      </header>

      <section className="space-y-2 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-ink text-lg font-bold">📱 Stored only on this phone</h2>
        <p className="text-ink-muted text-sm">
          Your profile, records, check-ins, medications, appointments, journal, activity and family
          notes. Thriver has no server copy, so clearing this browser or losing the phone loses
          them. Export a copy below.
        </p>
      </section>

      <section className="space-y-2 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-ink text-lg font-bold">↗ Shared only when you choose</h2>
        <ul className="text-ink space-y-2 text-sm">
          <li>
            <strong>Records assistant:</strong> your question, the list of your records, any record
            it opens and your health profile (not your name) go to Anthropic (Claude) to write the
            answer.
          </li>
          <li>
            <strong>AI picks:</strong> your cancer type, treatments, conditions and weeks since
            surgery go to Anthropic to choose guides and products.
          </li>
          <li>
            <strong>Family notes:</strong> travel inside the link you share.
          </li>
          <li>
            <strong>Recovery summary:</strong> only when you send or print it.
          </li>
        </ul>
      </section>

      <section aria-labelledby="consents-title" className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex justify-between">
          <h2 id="consents-title" className="text-ink text-lg font-bold">
            Your consents
          </h2>
          <span className="text-ink-muted">{consents.length}</span>
        </div>
        {consents.length === 0 ? (
          <p className="text-ink-muted mt-2 text-sm">
            You haven’t agreed to share anything with AI.
          </p>
        ) : (
          <ul className="divide-ink-muted/10 mt-2 divide-y">
            {consents.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-ink font-bold">{c.label}</p>
                  {c.at && (
                    <p className="text-ink-muted text-sm">
                      Agreed {agreedOn.format(new Date(c.at))}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={c.withdraw}
                  aria-label={`Withdraw consent: ${c.label}`}
                  className="text-move-ink font-bold"
                >
                  Withdraw
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        disabled={busy !== ''}
        onClick={() => void run('export')}
        className="text-ink border-ink-muted/25 flex w-full items-center justify-center gap-2 rounded-2xl border bg-white py-3.5 font-bold disabled:opacity-50"
      >
        <DownloadIcon className="size-5" />{' '}
        {busy === 'export' ? 'Preparing…' : 'Export all my data'}
      </button>

      {confirming ? (
        <div
          role="alertdialog"
          aria-labelledby="delete-title"
          className="bg-move space-y-3 rounded-3xl p-5"
        >
          <h2 id="delete-title" className="text-ink font-bold">
            Delete everything from this phone?
          </h2>
          <p className="text-ink text-sm">
            This removes your profile, records and all your entries. It can’t be undone. Export a
            copy first if you might want it.
          </p>
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
              disabled={busy !== ''}
              onClick={() => void run('delete')}
              className="bg-move-ink rounded-2xl py-3 font-bold text-white disabled:opacity-50"
            >
              {busy === 'delete' ? 'Deleting…' : 'Yes, delete'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-move-ink border-move w-full rounded-2xl border-2 bg-white py-3.5 font-bold"
        >
          Delete everything from this phone
        </button>
      )}

      {error && (
        <p role="alert" className="text-move-ink text-sm font-semibold">
          {error}
        </p>
      )}
      <p className="text-ink-muted text-center text-xs">
        A full privacy notice in English and Hindi is being prepared with legal review.
      </p>
    </div>
  )
}
