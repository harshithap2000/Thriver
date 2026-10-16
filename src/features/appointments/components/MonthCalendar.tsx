import { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'
import { dateKey, monthGrid, parseDateKey } from '@/shared/utils/date'

const monthTitle = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const dayLabel = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })
const weekdayNarrow = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' })
// 4–10 Jan 2026 is Sunday–Saturday, used to label the columns in the user's locale.
const weekdays = Array.from({ length: 7 }, (_, i) => weekdayNarrow.format(new Date(2026, 0, 4 + i)))

interface MonthCalendarProps {
  /** Selected date as YYYY-MM-DD. */
  selected: string
  onSelect: (date: string) => void
  /** Number of appointments per YYYY-MM-DD, shown as a dot. */
  counts: Record<string, number>
}

export function MonthCalendar({ selected, onSelect, counts }: MonthCalendarProps) {
  const [visible, setVisible] = useState(() => {
    const d = parseDateKey(selected)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const today = dateKey()
  const days = monthGrid(visible.year, visible.month)

  const shiftMonth = (delta: number) =>
    setVisible(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="text-ink hover:bg-mint grid size-9 place-items-center rounded-full"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <h2 className="text-ink font-bold" aria-live="polite">
          {monthTitle.format(new Date(visible.year, visible.month, 1))}
        </h2>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="text-ink hover:bg-mint grid size-9 place-items-center rounded-full"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center" aria-hidden="true">
        {weekdays.map((d, i) => (
          <span key={i} className="text-ink-muted pb-2 text-xs font-semibold">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const key = dateKey(day)
          const count = counts[key] ?? 0
          const inMonth = day.getMonth() === visible.month
          const isSelected = key === selected
          const isToday = key === today
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={`${dayLabel.format(day)}${count ? `, ${count} appointment${count > 1 ? 's' : ''}` : ''}`}
              className={cn(
                'relative mx-auto flex size-10 flex-col items-center justify-center rounded-full text-sm transition-colors',
                isSelected
                  ? 'bg-pine font-bold text-white'
                  : isToday
                    ? 'text-pine ring-pine/40 font-bold ring-2'
                    : inMonth
                      ? 'text-ink hover:bg-mint'
                      : 'text-ink-muted/40 hover:bg-mint',
              )}
            >
              {day.getDate()}
              {count > 0 && (
                <span
                  className={cn(
                    'absolute bottom-1 size-1.5 rounded-full',
                    isSelected ? 'bg-white' : 'bg-move-ink',
                  )}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
