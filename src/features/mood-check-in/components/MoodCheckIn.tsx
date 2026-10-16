import { cn } from '@/shared/utils/cn'

import { moods } from '../moods'
import { useMoodStore, useTodaysMood } from '../useMoodStore'
import { MoodFace } from './MoodFace'

export function MoodCheckIn() {
  const todaysMood = useTodaysMood()
  const checkIn = useMoodStore((s) => s.checkIn)
  const selected = moods.find((m) => m.id === todaysMood)

  return (
    <section aria-labelledby="check-in-title" className="space-y-3">
      <div>
        <h2 id="check-in-title" className="text-ink font-bold">
          Daily check-in
        </h2>
        <p className="text-ink-muted text-sm" aria-live="polite">
          {selected
            ? `Thanks for checking in. You're feeling ${selected.label.toLowerCase()} today.`
            : 'How are you feeling today?'}
        </p>
      </div>
      <ul className="flex justify-between gap-2">
        {moods.map((mood) => {
          const isSelected = mood.id === todaysMood
          return (
            <li key={mood.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => checkIn(mood.id)}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    'ring-pine ring-offset-cream block size-14 rounded-full ring-offset-2 transition-transform group-hover:scale-105 group-active:scale-95',
                    mood.face,
                    isSelected && 'ring-2',
                    todaysMood && !isSelected && 'opacity-60',
                  )}
                >
                  <MoodFace mouth={mood.mouth} />
                </span>
                <span
                  className={cn(
                    'text-xs',
                    isSelected ? 'text-ink font-bold' : 'text-ink-muted font-medium',
                  )}
                >
                  {mood.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
