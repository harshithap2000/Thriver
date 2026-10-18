import { Link } from 'react-router'

import { parseDateKey } from '@/shared/utils/date'

import { cancerLabel, conditions, treatments } from '../health'
import { useProfileStore } from '../useProfileStore'

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export function HealthProfileCard() {
  const health = useProfileStore((s) => s.health)
  const ai = useProfileStore((s) => s.aiPersonalise)

  const rows: [string, string][] = [
    ['Cancer', cancerLabel(health.cancerType) ?? 'Not shared'],
    [
      'Treatments',
      treatments
        .filter((t) => health.treatments.includes(t.id))
        .map((t) => t.label)
        .join(', ') || '—',
    ],
    ...(health.surgeryDate
      ? [['Surgery', dateFormat.format(parseDateKey(health.surgeryDate))] as [string, string]]
      : []),
    [
      'Watch for',
      conditions
        .filter((c) => health.conditions.includes(c.id))
        .map((c) => c.label)
        .join('; ') || '—',
    ],
    ['AI picks', ai ? 'On' : 'Off'],
  ]

  return (
    <div className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <dt className="text-ink-muted w-24 shrink-0 font-semibold">{label}</dt>
            <dd className="text-ink min-w-0">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        to="/profile/health"
        className="bg-mint text-pine inline-block rounded-full px-4 py-1.5 text-sm font-bold"
      >
        Edit health profile
      </Link>
    </div>
  )
}
