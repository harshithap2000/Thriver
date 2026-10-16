import { HeartIcon, PlayIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { routines, routineSeconds, type Routine } from '../routines'

export function RoutineList({ onStart }: { onStart: (routine: Routine) => void }) {
  return (
    <ul className="space-y-3">
      {routines.map((routine) => {
        const minutes = Math.round(routineSeconds(routine) / 60)
        return (
          <li key={routine.id}>
            <button
              type="button"
              onClick={() => onStart(routine)}
              aria-label={`Start ${routine.title}, ${minutes} minutes`}
              className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <span
                className={cn('grid size-14 shrink-0 place-items-center rounded-2xl', routine.tile)}
              >
                <HeartIcon className="text-move-ink size-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block leading-snug font-bold">{routine.title}</span>
                <span className="text-ink-muted block text-sm">
                  {minutes} min · {routine.steps.length} moves · {routine.description}
                </span>
              </span>
              <span className="bg-move text-move-ink grid size-10 shrink-0 place-items-center rounded-full">
                <PlayIcon className="ml-0.5 size-4" />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
