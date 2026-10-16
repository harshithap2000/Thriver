import { currentStreak, mostFrequentMood } from '../stats'
import { useMoodStore } from '../useMoodStore'

export function CheckInStats() {
  const checkIns = useMoodStore((s) => s.checkIns)
  const streak = currentStreak(checkIns)
  const total = Object.keys(checkIns).length
  const topMood = mostFrequentMood(checkIns)

  const stats = [
    { label: 'Day streak', value: String(streak), tile: 'bg-meditate' },
    { label: 'Check-ins', value: String(total), tile: 'bg-sleep' },
    { label: 'Most felt', value: topMood?.label ?? '–', tile: 'bg-reflect' },
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
