import { PlayIcon, SproutIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { sessions, type MeditationSession } from '../sessions'

export function SessionList({ onStart }: { onStart: (session: MeditationSession) => void }) {
  return (
    <ul className="space-y-3">
      {sessions.map((session) => (
        <li key={session.id}>
          <button
            type="button"
            onClick={() => onStart(session)}
            aria-label={`Start ${session.title}, ${session.minutes} minute${session.minutes > 1 ? 's' : ''}`}
            className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <span
              className={cn('grid size-14 shrink-0 place-items-center rounded-2xl', session.tile)}
            >
              <SproutIcon className="text-meditate-ink size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-ink block leading-snug font-bold">{session.title}</span>
              <span className="text-ink-muted block text-sm">
                {session.minutes} min · {session.description}
              </span>
            </span>
            <span className="bg-sleep text-sleep-ink grid size-10 shrink-0 place-items-center rounded-full">
              <PlayIcon className="ml-0.5 size-4" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
