import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { ACCEPTED_TYPES, MAX_FILE_BYTES, useRecordsStore } from '@/features/records'
import { Field } from '@/shared/ui/Field'
import { ChevronLeftIcon } from '@/shared/ui/icons'
import { dateKey } from '@/shared/utils/date'
import { cn } from '@/shared/utils/cn'

import { phaseInfo, type PhaseId } from '../phases'
import { useCurrentPhase, useRecoveryStore } from '../useRecoveryStore'

type Method = 'note' | 'told'

const methodCard = (on: boolean) =>
  cn(
    'flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-sm',
    on && 'ring-pine ring-2',
  )

/** Records that the care team has cleared the person for the next recovery phase. */
export function ClearanceForm({ phase }: { phase: PhaseId }) {
  const navigate = useNavigate()
  const current = useCurrentPhase()
  const clearPhase = useRecoveryStore((s) => s.clearPhase)
  const addRecord = useRecordsStore((s) => s.addRecord)
  const info = phaseInfo(phase)

  const [method, setMethod] = useState<Method | null>(null)
  const [by, setBy] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const back = (
    <Link
      to="/move"
      className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
    >
      <ChevronLeftIcon className="size-4" /> Move
    </Link>
  )

  if (phase !== current + 1) {
    return (
      <div className="space-y-4">
        {back}
        <h1 className="text-ink text-2xl font-extrabold">Phase {phase}</h1>
        <p className="text-ink-muted">
          {phase <= current
            ? 'You’ve already been cleared for this phase.'
            : `Phases unlock in order. You’re in Phase ${current} now.`}
        </p>
      </div>
    )
  }

  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    setError('')
    if (picked && !(ACCEPTED_TYPES as readonly string[]).includes(picked.type))
      return setError('Please choose a PDF or a photo.')
    if (picked && picked.size > MAX_FILE_BYTES) return setError('That file is too large.')
    setFile(picked)
  }

  const save = async () => {
    if (!by.trim()) return setError('Please say who cleared you.')
    if (method === 'note' && !file) return setError('Choose the signed note to save.')
    if (method === 'told' && !confirmed) return setError('Please tick the confirmation.')
    setSaving(true)
    try {
      let recordId: string | undefined
      if (method === 'note' && file) {
        const record = await addRecord(
          {
            title: `Clearance for recovery phase ${phase}`,
            category: 'letter',
            date: dateKey(),
            provider: by.trim(),
            notes: `Care team clearance to start "${info.name}".`,
          },
          file,
        )
        recordId = record.id
      }
      clearPhase(phase, { method: method ?? 'told', by: by.trim(), recordId })
      navigate('/move')
    } catch {
      setError("Couldn't save the note on this device. It may be out of storage space.")
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {back}
      <header>
        <h1 className="text-ink text-[1.75rem] leading-tight font-extrabold">
          Get cleared for Phase {phase}
        </h1>
        <p className="text-ink-muted mt-1">
          Ask your surgeon, oncologist or physiotherapist to {info.clearanceAsk}.
        </p>
      </header>

      <div className="space-y-3">
        <button
          type="button"
          aria-pressed={method === 'note'}
          onClick={() => setMethod('note')}
          className={methodCard(method === 'note')}
        >
          <span className="text-3xl" aria-hidden="true">
            📄
          </span>
          <span>
            <span className="text-ink block text-lg font-bold">Upload a signed note</span>
            <span className="text-ink-muted text-sm">Photo or PDF. Saved to your Records.</span>
          </span>
        </button>
        <button
          type="button"
          aria-pressed={method === 'told'}
          onClick={() => setMethod('told')}
          className={methodCard(method === 'told')}
        >
          <span className="text-3xl" aria-hidden="true">
            🩺
          </span>
          <span>
            <span className="text-ink block text-lg font-bold">They told me in person</span>
            <span className="text-ink-muted text-sm">At an appointment or on the phone</span>
          </span>
        </button>
        {[
          ['🏥', 'Enter a hospital code', 'When your hospital joins Thriver'],
          ['📱', 'Show a code to your physio', 'Needs Thriver online; coming soon'],
        ].map(([emoji, title, detail]) => (
          <div key={title} aria-disabled="true" className={cn(methodCard(false), 'opacity-55')}>
            <span className="text-3xl" aria-hidden="true">
              {emoji}
            </span>
            <span>
              <span className="text-ink block text-lg font-bold">{title}</span>
              <span className="text-ink-muted text-sm">{detail}</span>
            </span>
          </div>
        ))}
      </div>

      {method && (
        <form
          aria-label="Clearance details"
          onSubmit={(e) => {
            e.preventDefault()
            void save()
          }}
          className="space-y-3 rounded-3xl bg-white p-5 shadow-sm"
        >
          <Field
            label="Who cleared you?"
            placeholder="e.g. Dr Rao, physiotherapist"
            value={by}
            onChange={(e) => setBy(e.target.value)}
            maxLength={80}
          />
          {method === 'note' ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="clearance-file" className="text-ink text-sm font-semibold">
                Signed note
              </label>
              <input
                id="clearance-file"
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={pickFile}
                className="text-ink file:bg-mint file:text-pine text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:font-semibold"
              />
            </div>
          ) : (
            <label className="text-ink flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="accent-pine mt-0.5 size-5"
              />
              My care team told me I can start “{info.name}”.
            </label>
          )}
          {error && (
            <p role="alert" className="text-move-ink text-sm font-semibold">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="bg-pine hover:bg-ink w-full rounded-2xl py-3.5 font-bold text-white disabled:opacity-50"
          >
            {saving ? 'Saving…' : `Unlock Phase ${phase}`}
          </button>
        </form>
      )}

      <p className="text-ink-muted text-center text-sm">
        Clearance and its date are kept with your plan.
      </p>
    </div>
  )
}
