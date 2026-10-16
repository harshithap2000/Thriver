import { useSessionTimer } from '@/shared/hooks/useSessionTimer'
import { Button } from '@/shared/ui/Button'

import { routineSeconds, stepAt, type Routine } from '../routines'
import { useMoveStore } from '../useMoveStore'

const RING = 2 * Math.PI * 52

export function RoutinePlayer({ routine, onExit }: { routine: Routine; onExit: () => void }) {
  const logActivity = useMoveStore((s) => s.logActivity)
  const total = routineSeconds(routine)
  const timer = useSessionTimer(total, () =>
    logActivity({ kind: 'routine', minutes: total / 60, label: routine.title }),
  )
  const { index, step, start, remaining } = stepAt(routine, timer.elapsed)
  const next = routine.steps[index + 1]

  if (timer.isDone) {
    return (
      <section
        aria-labelledby="routine-done"
        className="bg-move/60 flex flex-col items-center gap-4 rounded-3xl px-6 py-12 text-center"
      >
        <span className="text-5xl" aria-hidden="true">
          🎉
        </span>
        <h2 id="routine-done" className="text-ink text-2xl font-extrabold">
          Nice moving!
        </h2>
        <p className="text-ink-muted">
          {routine.title} done · {Math.round(total / 60)} active minutes added to today.
        </p>
        <Button onClick={onExit} className="bg-pine hover:bg-ink mt-2">
          Done
        </Button>
      </section>
    )
  }

  const progress = 1 - remaining / step.seconds

  return (
    <section
      aria-label={`${routine.title} in progress`}
      className="bg-move/60 flex flex-col items-center gap-6 rounded-3xl px-6 py-8 text-center"
    >
      <div>
        <h2 className="text-ink text-lg font-bold">{routine.title}</h2>
        <p className="text-ink-muted text-sm">
          Move {index + 1} of {routine.steps.length}
        </p>
      </div>

      <div className="relative grid size-56 place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="white" stroke="white" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--color-move-ink)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="relative px-8" aria-live="polite">
          <p className="text-ink text-xl leading-tight font-extrabold">{step.name}</p>
          <p className="text-move-ink mt-1 text-3xl font-extrabold" aria-label="Seconds left">
            {remaining}
          </p>
        </div>
      </div>

      <p className="text-ink max-w-xs">{step.cue}</p>
      <p className="text-ink-muted text-sm">{next ? `Next: ${next.name}` : 'Last move!'}</p>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onExit}>
          End
        </Button>
        {timer.isRunning ? (
          <Button onClick={timer.pause} className="bg-pine hover:bg-ink min-w-24">
            Pause
          </Button>
        ) : (
          <Button onClick={timer.resume} className="bg-pine hover:bg-ink min-w-24">
            Resume
          </Button>
        )}
        <Button variant="secondary" onClick={() => timer.seek(start + step.seconds)}>
          Skip
        </Button>
      </div>
    </section>
  )
}
