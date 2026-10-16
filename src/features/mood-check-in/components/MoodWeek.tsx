import { cn } from '@/shared/utils/cn'

import { moods } from '../moods'
import { lastNDays } from '../stats'
import { dateKey, useMoodStore } from '../useMoodStore'
import { MoodFace } from './MoodFace'

const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const fullDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

/** The last seven days of check-ins, today last. */
export function MoodWeek() {
  const checkIns = useMoodStore((s) => s.checkIns)
  const days = lastNDays(7)

  return (
    <ol className="grid grid-cols-7 gap-1">
      {days.map((day, i) => {
        const mood = moods.find((m) => m.id === checkIns[dateKey(day)])
        const isToday = i === days.length - 1
        return (
          <li
            key={dateKey(day)}
            aria-label={`${fullDate.format(day)}: ${mood ? mood.label : 'no check-in'}`}
            className="flex flex-col items-center gap-1.5"
          >
            {mood ? (
              <span className={cn('block size-9 rounded-full', mood.face)}>
                <MoodFace mouth={mood.mouth} />
              </span>
            ) : (
              <span className="border-ink-muted/30 block size-9 rounded-full border-2 border-dashed" />
            )}
            <span
              aria-hidden="true"
              className={cn('text-xs', isToday ? 'text-pine font-bold' : 'text-ink-muted')}
            >
              {isToday ? 'Today' : weekday.format(day)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
