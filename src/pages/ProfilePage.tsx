import { Link } from 'react-router'

import { CheckInStats, ClearHistoryButton, MoodWeek } from '@/features/mood-check-in'
import { HealthProfileCard, ProfileHeader } from '@/features/profile'
import { ChevronRightIcon } from '@/shared/ui/icons'

const links = [
  {
    to: '/profile/summary',
    emoji: '📋',
    title: 'Recovery summary for your doctor',
    detail: 'Share on WhatsApp or save as PDF',
  },
  {
    to: '/profile/privacy',
    emoji: '🔒',
    title: 'Your privacy',
    detail: 'What’s stored and shared, consents, export, delete',
  },
]

export default function ProfilePage() {
  return (
    <div className="space-y-7">
      <ProfileHeader />

      <section aria-labelledby="health-title" className="space-y-3">
        <h2 id="health-title" className="text-ink font-bold">
          Your health profile
        </h2>
        <HealthProfileCard />
      </section>

      <nav aria-label="Profile pages" className="space-y-3">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm"
          >
            <span
              aria-hidden="true"
              className="bg-mint grid size-12 place-items-center rounded-2xl text-2xl"
            >
              {l.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-ink block font-bold">{l.title}</span>
              <span className="text-ink-muted text-sm">{l.detail}</span>
            </span>
            <ChevronRightIcon className="text-ink-muted size-4" />
          </Link>
        ))}
      </nav>

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
