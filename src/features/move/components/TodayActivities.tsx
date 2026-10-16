import { TrashIcon } from '@/shared/ui/icons'
import { dateKey } from '@/shared/utils/date'

import { kindInfo } from '../activities'
import { useMoveStore } from '../useMoveStore'

export function TodayActivities() {
  const activities = useMoveStore((s) => s.activities)
  const removeActivity = useMoveStore((s) => s.removeActivity)
  const today = activities.filter((a) => a.date === dateKey())

  if (today.length === 0) {
    return (
      <p className="border-ink-muted/20 text-ink-muted rounded-2xl border-2 border-dashed p-4 text-center text-sm">
        Nothing logged yet today. Every minute counts!
      </p>
    )
  }

  return (
    <ul className="divide-cream divide-y overflow-hidden rounded-3xl bg-white shadow-sm">
      {today.map((a) => {
        const info = kindInfo(a.kind)
        const name = a.label ?? info.label
        return (
          <li key={a.id} className="flex items-center gap-3 px-4 py-3">
            <span className="text-2xl" aria-hidden="true">
              {info.emoji}
            </span>
            <span className="text-ink flex-1 font-semibold">{name}</span>
            <span className="text-ink-muted text-sm">{a.minutes} min</span>
            <button
              type="button"
              onClick={() => removeActivity(a.id)}
              aria-label={`Remove ${name}, ${a.minutes} minutes`}
              className="text-ink-muted hover:bg-move/40 hover:text-move-ink grid size-8 place-items-center rounded-full"
            >
              <TrashIcon className="size-4" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
