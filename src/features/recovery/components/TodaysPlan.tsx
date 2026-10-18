import { Link } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { CheckIcon } from '@/shared/ui/icons'
import { dateKey } from '@/shared/utils/date'
import { cn } from '@/shared/utils/cn'

import { planFor } from '../phases'
import { useCurrentPhase, usePausedToday, useRecoveryStore } from '../useRecoveryStore'

/** Home: today's plan for the current phase, with tick boxes. */
export function TodaysPlan() {
  const health = useProfileStore((s) => s.health)
  const phase = useCurrentPhase()
  const paused = usePausedToday()
  const done = useRecoveryStore((s) => s.planDone[dateKey()]) ?? []
  const toggle = useRecoveryStore((s) => s.togglePlanItem)
  const items = planFor(phase, health).filter((item) => !(paused && item.active))

  return (
    <section aria-labelledby="plan-title" className="space-y-3">
      <h2 id="plan-title" className="text-ink font-bold">
        Today’s plan
      </h2>
      {paused && (
        <p className="text-ink-muted text-sm">
          Exercise is paused today because of your check-in. Rest, and contact your care team.
        </p>
      )}
      <ul className="divide-ink-muted/10 divide-y rounded-3xl bg-white px-4 shadow-sm">
        {items.map((item) => {
          const isDone = done.includes(item.id)
          return (
            <li key={item.id} className="flex items-center gap-3 py-3.5">
              <span aria-hidden="true" className="text-2xl">
                {item.emoji}
              </span>
              <div className="min-w-0 flex-1">
                {item.to ? (
                  <Link to={item.to} className="text-ink font-bold hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  <p className="text-ink font-bold">{item.title}</p>
                )}
                <p className="text-ink-muted text-sm">{item.detail}</p>
              </div>
              <button
                type="button"
                aria-pressed={isDone}
                aria-label={`${item.title}: ${isDone ? 'done' : 'not done'}`}
                onClick={() => toggle(item.id)}
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-xl border-2 transition-colors',
                  isDone ? 'bg-pine border-pine text-white' : 'border-ink-muted/30 bg-white',
                )}
              >
                {isDone && <CheckIcon className="size-4" />}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
