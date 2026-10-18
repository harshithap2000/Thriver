import { Link } from 'react-router'

import { cancerLabel, useProfileStore } from '@/features/profile'
import { parseDateKey } from '@/shared/utils/date'
import { cn } from '@/shared/utils/cn'

import { daysSince, phaseInfo, phases } from '../phases'
import { useCurrentPhase } from '../useRecoveryStore'

const shortDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })

/** Home: days since surgery, the current recovery phase and progress through the phases. */
export function RecoveryCard() {
  const health = useProfileStore((s) => s.health)
  const phase = phaseInfo(useCurrentPhase())
  const days = daysSince(health.surgeryDate)
  const cancer = cancerLabel(health.cancerType)

  return (
    <Link
      to="/move"
      aria-labelledby="recovery-title"
      className="bg-mint block space-y-3 rounded-3xl p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="bg-sleep text-sleep-ink rounded-full px-3 py-1 text-xs font-extrabold tracking-wide uppercase">
          {days === null ? 'Your recovery' : `Day ${days} since surgery`}
        </span>
        {(cancer || health.surgeryDate) && (
          <span className="text-ink-muted text-xs">
            {[cancer, health.surgeryDate && shortDate.format(parseDateKey(health.surgeryDate))]
              .filter(Boolean)
              .join(' · ')}
          </span>
        )}
      </div>
      <div>
        <h2 id="recovery-title" className="text-ink text-lg font-extrabold">
          Phase {phase.id} · {phase.name}
        </h2>
        <p className="text-ink-muted text-sm">{phase.summary}</p>
      </div>
      <ol aria-label="Recovery phases" className="grid grid-cols-4 gap-1.5">
        {phases.map((p) => (
          <li key={p.id} aria-current={p.id === phase.id ? 'step' : undefined}>
            <span
              className={cn(
                'block h-1.5 rounded-full',
                p.id < phase.id ? 'bg-pine' : p.id === phase.id ? 'bg-pine/60' : 'bg-white',
              )}
            />
            <span className="text-ink-muted mt-1 block text-xs">{p.short}</span>
          </li>
        ))}
      </ol>
    </Link>
  )
}
