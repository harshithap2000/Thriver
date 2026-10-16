import { CheckInStats, ClearHistoryButton, MoodWeek } from '@/features/mood-check-in'
import { ProfileHeader } from '@/features/profile'

export default function ProfilePage() {
  return (
    <div className="space-y-7">
      <ProfileHeader />

      <section aria-labelledby="progress-title" className="space-y-3">
        <h2 id="progress-title" className="text-ink font-bold">
          Your progress
        </h2>
        <CheckInStats />
      </section>

      <section aria-labelledby="week-title" className="space-y-3">
        <h2 id="week-title" className="text-ink font-bold">
          Your week
        </h2>
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <MoodWeek />
        </div>
      </section>

      <section aria-labelledby="settings-title" className="space-y-3">
        <h2 id="settings-title" className="text-ink font-bold">
          Settings
        </h2>
        <div className="divide-cream divide-y overflow-hidden rounded-3xl bg-white shadow-sm">
          <ClearHistoryButton className="text-move-ink hover:bg-move/30 disabled:text-ink-muted/50 w-full px-5 py-4 text-left font-semibold disabled:cursor-not-allowed disabled:hover:bg-transparent" />
          <p className="text-ink-muted px-5 py-4 text-sm">
            Thriver v{__APP_VERSION__} · Your data stays on this device.
          </p>
        </div>
      </section>
    </div>
  )
}
