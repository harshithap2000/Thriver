import { cn } from '@/shared/utils/cn'
import { addDays, dateKey } from '@/shared/utils/date'

import { minutesByDay, useMoveStore } from '../useMoveStore'

const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const fullDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export function WeekChart() {
  const activities = useMoveStore((s) => s.activities)
  const goal = useMoveStore((s) => s.dailyGoal)
  const totals = minutesByDay(activities)
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 6))
  const max = Math.max(goal, ...days.map((d) => totals[dateKey(d)] ?? 0))

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <ol className="relative flex h-36 items-end justify-between gap-2">
        {/* Goal line: bars sit on a 16px label + 6px gap, in a 112px (h-28) track. */}
        <div
          className="border-pine/30 pointer-events-none absolute inset-x-0 border-t-2 border-dashed"
          style={{ bottom: `calc(22px + ${(goal / max) * 112}px)` }}
          aria-hidden="true"
        />
        {days.map((day, i) => {
          const minutes = totals[dateKey(day)] ?? 0
          const isToday = i === 6
          return (
            <li
              key={dateKey(day)}
              aria-label={`${fullDate.format(day)}: ${minutes} active minutes`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              <div className="flex h-28 w-full items-end justify-center">
                <div
                  className={cn(
                    'w-full max-w-7 rounded-t-lg transition-[height] duration-500',
                    minutes >= goal ? 'bg-pine' : minutes > 0 ? 'bg-meditate-ink/50' : 'bg-cream',
                  )}
                  style={{ height: `${Math.max(minutes > 0 ? 6 : 3, (minutes / max) * 100)}%` }}
                />
              </div>
              <span
                aria-hidden="true"
                className={cn('h-4 text-xs', isToday ? 'text-pine font-bold' : 'text-ink-muted')}
              >
                {isToday ? 'Today' : weekday.format(day)}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="text-ink-muted mt-2 text-right text-xs">Dashed line: your daily goal</p>
    </div>
  )
}
