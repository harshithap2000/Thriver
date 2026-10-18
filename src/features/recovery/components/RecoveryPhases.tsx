import { Link } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { CheckIcon, PlayIcon } from '@/shared/ui/icons'
import { PendingReview } from '@/shared/ui/Notices'
import { cn } from '@/shared/utils/cn'

import { adaptations, phases, planFor } from '../phases'
import { useCurrentPhase, usePausedToday, useRecoveryStore } from '../useRecoveryStore'

const clearedDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })

/** Move: the four recovery phases. Later phases unlock when the care team clears the person. */
export function RecoveryPhases() {
  const health = useProfileStore((s) => s.health)
  const current = useCurrentPhase()
  const clearances = useRecoveryStore((s) => s.clearances)
  const paused = usePausedToday()
  const notes = adaptations(health)

  return (
    <section aria-labelledby="phases-title" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="phases-title" className="text-ink font-bold">
          Your recovery plan
        </h2>
        <PendingReview label="Content pending clinical review" />
      </div>

      {paused && (
        <Link to="/check-in/alert" className="bg-move text-ink block rounded-2xl p-4 text-sm">
          <strong>Paused today.</strong> Your check-in reported a warning sign, so exercise is
          paused until tomorrow’s check-in. <span className="underline">See who to call</span>
        </Link>
      )}

      <ol className="space-y-3">
        {phases.map((phase) => {
          const clearance = clearances[phase.id]
          const isCurrent = phase.id === current
          const isNext = phase.id === current + 1
          return (
            <li
              key={phase.id}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'space-y-3 rounded-3xl bg-white p-5 shadow-sm',
                isCurrent && 'ring-pine ring-2',
                phase.id > current + 1 && 'opacity-60',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className={cn('text-lg font-bold', isCurrent ? 'text-ink' : 'text-ink/80')}>
                  {phase.id} · {phase.name}
                </h3>
                {phase.id < current && (
                  <span className="bg-mint text-pine inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                    <CheckIcon className="size-3" /> Done
                  </span>
                )}
                {isCurrent && (
                  <span className="bg-sleep text-sleep-ink rounded-full px-2.5 py-1 text-xs font-extrabold uppercase">
                    You are here
                  </span>
                )}
                {phase.id > current && (
                  <span aria-label="Locked" className="text-lg">
                    🔒
                  </span>
                )}
              </div>

              {!isCurrent && phase.id <= current + 1 && (
                <p className="text-ink-muted text-sm">
                  {phase.id < current
                    ? phase.summary
                    : 'Unlocks when your care team says you’re ready'}
                </p>
              )}
              {clearance && (
                <p className="text-ink-muted text-xs">
                  Cleared by {clearance.by} on {clearedDate.format(new Date(clearance.at))}
                </p>
              )}

              {isCurrent && (
                <>
                  <p className="text-ink-muted text-sm">{phase.summary}</p>
                  <ul className="space-y-2">
                    {planFor(phase.id, health)
                      .filter((item) => item.active)
                      .map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="bg-mint grid size-12 shrink-0 place-items-center rounded-2xl text-2xl"
                          >
                            {item.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-ink font-bold">{item.title}</p>
                            <p className="text-ink-muted text-sm">{item.detail}</p>
                          </div>
                          {item.to && !paused && (
                            <Link
                              to={item.to}
                              aria-label={`Start ${item.title}`}
                              className="bg-move text-move-ink grid size-10 shrink-0 place-items-center rounded-full"
                            >
                              <PlayIcon className="size-4" />
                            </Link>
                          )}
                        </li>
                      ))}
                  </ul>
                  {notes.length > 0 && (
                    <p className="bg-mint text-ink rounded-2xl p-3 text-sm">
                      ✨ Adapted for you: {notes.join('; ')}
                    </p>
                  )}
                </>
              )}

              {isNext && (
                <Link
                  to={`/move/clearance/${phase.id}`}
                  className="border-ink-muted/25 text-ink hover:bg-mint block rounded-2xl border py-3 text-center font-bold"
                >
                  Get cleared for Phase {phase.id}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
