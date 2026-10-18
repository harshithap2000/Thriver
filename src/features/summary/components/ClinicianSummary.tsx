import { useState } from 'react'
import { Link } from 'react-router'

import { useMedicationStore } from '@/features/medication'
import { useMoveStore } from '@/features/move'
import { cancerLabel, useProfileStore } from '@/features/profile'
import {
  phaseInfo,
  planFor,
  useCurrentPhase,
  useRecoveryStore,
  warningSignsFor,
} from '@/features/recovery'
import { ChevronLeftIcon } from '@/shared/ui/icons'
import { parseDateKey } from '@/shared/utils/date'

import { buildSummary, percent, type Summary, type Trend } from '../buildSummary'

const PERIODS = [7, 14, 30] as const
const day = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
const fullDay = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const trendText = (t: Trend | null) =>
  t ? `${t.first} → ${t.last}${t.last < t.first ? ' ↓' : t.last > t.first ? ' ↑' : ''}` : '—'

function shareText(summary: Summary, header: string, warningLabel: (id: string) => string) {
  const lines = [
    `Thriver recovery summary, ${day.format(parseDateKey(summary.from))}–${fullDay.format(parseDateKey(summary.to))}`,
    header,
    `Plan sessions done: ${summary.sessions.done}/${summary.sessions.planned}`,
    `Active minutes: ${summary.activeMinutes}`,
    summary.doses && `Doses taken: ${percent(summary.doses.taken, summary.doses.due)}`,
    `Tiredness (avg, 0–10): ${trendText(summary.tiredness)}`,
    `Pain (avg, 0–10): ${trendText(summary.pain)}`,
    `Check-ins: ${summary.checkInCount}`,
    ...summary.alerts.map(
      (a) =>
        `Warning sign ${day.format(parseDateKey(a.date))}: ${a.warnings.map(warningLabel).join(', ')}`,
    ),
    'Patient-reported data from the Thriver app. Not a clinical record.',
  ]
  return lines.filter(Boolean).join('\n')
}

/** A one-page, patient-reported recovery report to share with the care team. */
export function ClinicianSummary() {
  const [days, setDays] = useState<(typeof PERIODS)[number]>(14)
  const { name, health } = useProfileStore()
  const phase = phaseInfo(useCurrentPhase())
  const { planDone, checkIns } = useRecoveryStore()
  const activities = useMoveStore((s) => s.activities)
  const { medications, taken } = useMedicationStore()

  const summary = buildSummary({
    days,
    activePlanIds: planFor(phase.id, health)
      .filter((i) => i.active)
      .map((i) => i.id),
    planDone,
    checkIns,
    activities,
    medications,
    taken,
  })
  const signs = warningSignsFor({ ...health, treatments: ['surgery'] })
  const warningLabel = (id: string) => signs.find((s) => s.id === id)?.question[0] ?? id

  const header = [
    name || 'Patient',
    cancerLabel(health.cancerType) && `${cancerLabel(health.cancerType)} cancer`,
    health.surgeryDate && `Surgery ${fullDay.format(parseDateKey(health.surgeryDate))}`,
    `Phase ${phase.id} (${phase.name})`,
  ]
    .filter(Boolean)
    .join(' · ')
  const maxMinutes = Math.max(10, ...summary.dailyMinutes.map((d) => d.minutes))
  const text = shareText(summary, header, warningLabel)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between print:hidden">
        <Link
          to="/profile"
          className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeftIcon className="size-4" /> Profile
        </Link>
        <label className="text-ink-muted flex items-center gap-2 text-sm">
          <span className="sr-only">Period</span>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value) as (typeof PERIODS)[number])}
            className="rounded-xl bg-white px-2 py-1 font-semibold shadow-sm"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                Last {p} days
              </option>
            ))}
          </select>
        </label>
      </div>

      <article
        aria-labelledby="summary-title"
        className="space-y-4 rounded-3xl bg-white p-5 shadow-sm print:shadow-none"
      >
        <header className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <h1 id="summary-title" className="text-ink text-xl font-extrabold">
              Recovery summary
            </h1>
            <p className="text-ink-muted text-sm">
              {day.format(parseDateKey(summary.from))}–{fullDay.format(parseDateKey(summary.to))}
            </p>
          </div>
          <p className="text-ink">{header}</p>
        </header>

        <dl className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-meditate flex flex-col-reverse rounded-2xl p-3">
            <dt className="text-ink-muted text-xs">
              Plan sessions ({summary.sessions.done}/{summary.sessions.planned})
            </dt>
            <dd className="text-ink text-2xl font-extrabold">
              {percent(summary.sessions.done, summary.sessions.planned)}
            </dd>
          </div>
          <div className="bg-sleep flex flex-col-reverse rounded-2xl p-3">
            <dt className="text-ink-muted text-xs">Active min</dt>
            <dd className="text-ink text-2xl font-extrabold">{summary.activeMinutes}</dd>
          </div>
          <div className="bg-reflect flex flex-col-reverse rounded-2xl p-3">
            <dt className="text-ink-muted text-xs">Doses taken</dt>
            <dd className="text-ink text-2xl font-extrabold">
              {summary.doses ? percent(summary.doses.taken, summary.doses.due) : '—'}
            </dd>
          </div>
        </dl>

        <figure>
          <figcaption className="text-ink-muted mb-2 text-xs">Daily active minutes</figcaption>
          <ol className="flex h-20 items-end gap-0.5" aria-label="Daily active minutes">
            {summary.dailyMinutes.map((d) => (
              <li
                key={d.date}
                aria-label={`${day.format(parseDateKey(d.date))}: ${d.minutes} minutes`}
                className="bg-pine flex-1 rounded-t-sm"
                style={{ height: `${Math.max(2, (d.minutes / maxMinutes) * 100)}%` }}
              />
            ))}
          </ol>
        </figure>

        <dl className="divide-ink-muted/10 divide-y text-sm">
          {[
            ['Tiredness (avg)', trendText(summary.tiredness)],
            ['Pain (avg)', trendText(summary.pain)],
            [
              'Swelling',
              summary.swellingDays
                ? `Reported on ${summary.swellingDays} day${summary.swellingDays > 1 ? 's' : ''}`
                : 'None reported',
            ],
            ['Check-ins', `${summary.checkInCount} of ${days} days`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2">
              <dt className="text-ink">{label}</dt>
              <dd className="text-ink font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        {summary.alerts.map((a) => (
          <p key={a.date} className="bg-move text-ink rounded-2xl p-3 text-sm">
            ⚠ Warning sign reported {day.format(parseDateKey(a.date))}:{' '}
            {a.warnings.map(warningLabel).join(', ')}; advised to contact care team
          </p>
        ))}

        <p className="text-ink-muted text-xs">
          Patient-reported data from the Thriver app. Not a clinical record.
        </p>
      </article>

      <div className="grid grid-cols-2 gap-3 print:hidden">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-pine hover:bg-ink rounded-2xl py-3.5 text-center font-bold text-white"
        >
          Share on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-ink border-ink-muted/25 rounded-2xl border bg-white py-3.5 font-bold"
        >
          Save as PDF
        </button>
      </div>
      <p className="text-ink-muted text-center text-xs print:hidden">
        “Save as PDF” opens your phone’s print screen; choose Save as PDF there.
      </p>
    </div>
  )
}
