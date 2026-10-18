import { Link } from 'react-router'

import { useTodaysCheckIn } from '../useRecoveryStore'

/** Home: invites the daily symptom check-in, or summarises today's. */
export function CheckInPrompt() {
  const today = useTodaysCheckIn()

  if (today?.warnings.length) {
    return (
      <Link
        to="/check-in/alert"
        className="bg-move flex items-center justify-between gap-3 rounded-3xl p-5"
      >
        <span>
          <span className="text-ink block font-bold">Exercise is paused today</span>
          <span className="text-ink-muted text-sm">
            You reported a warning sign. See who to call.
          </span>
        </span>
        <span className="bg-move-ink shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white">
          View
        </span>
      </Link>
    )
  }

  return (
    <div className="bg-reflect flex items-center justify-between gap-3 rounded-3xl p-5">
      <div aria-live="polite">
        <h2 className="text-ink font-bold">
          {today ? 'Thanks for checking in' : 'How are you feeling today?'}
        </h2>
        <p className="text-ink-muted text-sm">
          {today
            ? `Tiredness ${today.tiredness}/10 · Pain ${today.pain}/10`
            : '1-minute symptom check-in'}
        </p>
      </div>
      <Link
        to="/check-in"
        className="bg-pine hover:bg-ink shrink-0 rounded-full px-4 py-2.5 text-sm font-bold text-white"
      >
        {today ? 'Edit' : 'Check in'}
      </Link>
    </div>
  )
}
