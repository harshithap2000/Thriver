import { addDays, dateKey } from '@/shared/utils/date'

import { useMeditationStore } from '../useMeditationStore'

export function MeditationStats() {
  const history = useMeditationStore((s) => s.history)
  // Last 7 calendar days, including today.
  const weekStart = dateKey(addDays(new Date(), -6))
  const minutes = history.reduce((sum, h) => sum + h.minutes, 0)
  const thisWeek = history.filter((h) => dateKey(new Date(h.completedAt)) >= weekStart).length

  const stats = [
    { label: 'Minutes', value: minutes, tile: 'bg-meditate' },
    { label: 'Sessions', value: history.length, tile: 'bg-sleep' },
    { label: 'This week', value: thisWeek, tile: 'bg-reflect' },
  ]

  return (
    <dl className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, tile }) => (
        <div key={label} className={`flex flex-col-reverse rounded-2xl p-3 text-center ${tile}`}>
          <dt className="text-ink-muted text-xs font-semibold">{label}</dt>
          <dd className="text-ink text-xl font-extrabold">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
