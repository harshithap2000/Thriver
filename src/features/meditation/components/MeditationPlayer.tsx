import { useSessionTimer } from '@/shared/hooks/useSessionTimer'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

import { formatClock, phaseAt, phaseLabels, type MeditationSession } from '../sessions'
import { useMeditationStore } from '../useMeditationStore'

const expanded = { in: true, hold: true, out: false, rest: false } as const

interface MeditationPlayerProps {
  session: MeditationSession
  onExit: () => void
}

export function MeditationPlayer({ session, onExit }: MeditationPlayerProps) {
  const logSession = useMeditationStore((s) => s.logSession)
  const { elapsed, remaining, isRunning, isDone, pause, resume } = useSessionTimer(
    session.minutes * 60,
    () => logSession(session.id, session.minutes),
  )
  const { phase, duration, remaining: phaseLeft } = phaseAt(session.pattern, elapsed)
  const cue = session.cues?.[Math.floor(elapsed / 30) % session.cues.length]

  if (isDone) {
    return (
      <section
        aria-labelledby="session-done"
        className="bg-mint flex flex-col items-center gap-4 rounded-3xl px-6 py-12 text-center"
      >
        <span className="text-5xl" aria-hidden="true">
          🌿
        </span>
        <h2 id="session-done" className="text-ink text-2xl font-extrabold">
          Well done
        </h2>
        <p className="text-ink-muted">
          You completed {session.title} · {session.minutes} mindful minute
          {session.minutes > 1 ? 's' : ''}.
        </p>
        <Button onClick={onExit} className="bg-pine hover:bg-ink mt-2">
          Done
        </Button>
      </section>
    )
  }

  return (
    <section
      aria-label={`${session.title} in progress`}
      className="bg-mint flex flex-col items-center gap-8 rounded-3xl px-6 py-10 text-center"
    >
      <div>
        <h2 className="text-ink text-lg font-bold">{session.title}</h2>
        <p className="text-ink-muted text-sm" aria-label="Time remaining">
          {formatClock(remaining)} left
        </p>
      </div>

      {/* The circle grows while breathing in and shrinks while breathing out, over the phase's length. */}
      <div className="grid size-64 place-items-center">
        <div
          className={cn(
            'bg-meditate/70 col-start-1 row-start-1 size-64 rounded-full motion-safe:transition-transform motion-safe:ease-in-out',
            expanded[phase] ? 'scale-100' : 'scale-[0.6]',
          )}
          style={{ transitionDuration: `${duration}s` }}
          aria-hidden="true"
        />
        <div
          className={cn(
            'col-start-1 row-start-1 size-44 rounded-full bg-white/80 motion-safe:transition-transform motion-safe:ease-in-out',
            expanded[phase] ? 'scale-100' : 'scale-75',
          )}
          style={{ transitionDuration: `${duration}s` }}
          aria-hidden="true"
        />
        <div className="relative z-10 col-start-1 row-start-1" aria-live="polite">
          <p className="text-ink text-2xl font-extrabold">{phaseLabels[phase]}</p>
          <p className="text-ink-muted" aria-hidden="true">
            {phaseLeft}
          </p>
        </div>
      </div>

      {cue && <p className="text-ink max-w-xs text-lg leading-snug font-semibold">{cue}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onExit}>
          End
        </Button>
        {isRunning ? (
          <Button onClick={pause} className="bg-pine hover:bg-ink min-w-28">
            Pause
          </Button>
        ) : (
          <Button onClick={resume} className="bg-pine hover:bg-ink min-w-28">
            Resume
          </Button>
        )}
      </div>
    </section>
  )
}
