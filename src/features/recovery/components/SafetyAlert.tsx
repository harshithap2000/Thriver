import { Link } from 'react-router'

import { useProfileStore } from '@/features/profile'
import { CareDisclaimer, PendingReview } from '@/shared/ui/Notices'

import { useTodaysCheckIn } from '../useRecoveryStore'
import { emergencyNumbers, warningSignsFor } from '../warningSigns'

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** Shown after a check-in that reported a warning sign: pause exercise, and who to contact. */
export function SafetyAlert() {
  const health = useProfileStore((s) => s.health)
  const careTeam = useProfileStore((s) => s.careTeam)
  const checkIn = useTodaysCheckIn()
  const reported = warningSignsFor(health).filter((s) => checkIn?.warnings.includes(s.id))

  if (reported.length === 0) {
    return (
      <div className="space-y-4 py-10 text-center">
        <h1 className="text-ink text-2xl font-extrabold">No warning signs today</h1>
        <p className="text-ink-muted">If anything changes, check in again.</p>
        <Link to="/" className="text-pine font-bold underline">
          Back to Home
        </Link>
      </div>
    )
  }

  const urgent = reported.some((s) => s.urgent)

  return (
    <div className="space-y-5 pt-4 text-center">
      <p className="text-6xl" aria-hidden="true">
        {urgent ? '🚑' : '🤒'}
      </p>
      <h1 className="text-ink text-[1.75rem] leading-tight font-extrabold">
        Let’s pause exercise today
      </h1>
      {reported.map((s) => (
        <p key={s.id} className="text-ink-muted text-lg">
          {s.explanation}
        </p>
      ))}

      <section className="space-y-2 rounded-3xl bg-white p-5 shadow-sm">
        {careTeam.phone ? (
          <>
            <a
              href={telHref(careTeam.phone)}
              className="bg-pine hover:bg-ink block rounded-2xl py-4 text-lg font-bold text-white"
            >
              📞 Call {careTeam.name || 'your care team'}
            </a>
            <p className="text-ink-muted text-sm">From your profile · {careTeam.phone}</p>
          </>
        ) : (
          <>
            <p className="text-ink font-bold">Call your hospital or care team today.</p>
            <Link to="/profile/health" className="text-pine text-sm font-bold underline">
              Add their number to your profile
            </Link>
          </>
        )}
      </section>

      <section className="bg-move space-y-3 rounded-3xl p-5 text-left">
        <h2 className="text-ink text-lg font-bold">Feeling very unwell?</h2>
        <p className="text-ink text-sm">
          Severe breathlessness, chest pain, confusion or heavy bleeding:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {emergencyNumbers.map((e) => (
            <a
              key={e.number}
              href={`tel:${e.number}`}
              className="bg-move-ink rounded-2xl py-3.5 text-center text-lg font-bold text-white"
            >
              {e.label} {e.number}
            </a>
          ))}
        </div>
      </section>

      <p className="text-ink-muted text-sm">Your Move plan is paused until tomorrow’s check-in.</p>
      <PendingReview label="Rules pending clinical review" />
      <CareDisclaimer className="text-left" />
      <Link to="/check-in" className="text-ink-muted block text-sm underline">
        Change today’s check-in
      </Link>
    </div>
  )
}
