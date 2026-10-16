import { dateKey } from '@/shared/utils/date'

import { GOAL_OPTIONS, minutesByDay, useMoveStore } from '../useMoveStore'

const RING = 2 * Math.PI * 40

export function TodayProgress() {
  const activities = useMoveStore((s) => s.activities)
  const goal = useMoveStore((s) => s.dailyGoal)
  const setDailyGoal = useMoveStore((s) => s.setDailyGoal)
  const today = minutesByDay(activities)[dateKey()] ?? 0
  const ratio = Math.min(1, today / goal)

  return (
    <div className="bg-mint flex items-center gap-5 rounded-3xl p-5">
      <div
        role="progressbar"
        aria-label="Active minutes today"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(today, goal)}
        className="relative grid size-24 shrink-0 place-items-center"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="11" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--color-pine)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - ratio)}
            className="transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <span className="text-ink text-2xl font-extrabold">{today}</span>
      </div>
      <div className="min-w-0">
        <p className="text-ink font-bold" aria-live="polite">
          {today >= goal ? 'Goal reached! 🌟' : `${today} of ${goal} active minutes`}
        </p>
        <label className="text-ink-muted mt-2 flex items-center gap-2 text-sm">
          Daily goal
          <select
            value={goal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="border-ink-muted/25 text-ink rounded-lg border bg-white px-2 py-1 font-semibold"
          >
            {GOAL_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g} min
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
