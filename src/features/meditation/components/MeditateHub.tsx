import { useSearchParams } from 'react-router'

import { findSession, sessions } from '../sessions'
import { MeditationPlayer } from './MeditationPlayer'
import { MeditationStats } from './MeditationStats'
import { SessionList } from './SessionList'

/** Session picker and player. The active session lives in the URL (?session=id) so it can be linked to. */
export function MeditateHub() {
  const [params, setParams] = useSearchParams()
  const active = findSession(params.get('session'))

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">Meditate</h1>
        <p className="text-ink-muted">Breathe along with the circle.</p>
      </header>

      {active ? (
        <MeditationPlayer key={active.id} session={active} onExit={() => setParams({})} />
      ) : (
        <>
          <section aria-labelledby="meditate-progress" className="space-y-3">
            <h2 id="meditate-progress" className="text-ink font-bold">
              Your practice
            </h2>
            <MeditationStats />
          </section>
          <section aria-labelledby="meditate-survivors" className="space-y-3">
            <h2 id="meditate-survivors" className="text-ink flex items-center gap-2 font-bold">
              For survivors
              <span className="bg-sleep text-sleep-ink rounded-full px-2 py-0.5 text-xs">New</span>
            </h2>
            <SessionList
              items={sessions.filter((s) => s.forSurvivors)}
              onStart={(s) => setParams({ session: s.id })}
            />
          </section>
          <section aria-labelledby="meditate-sessions" className="space-y-3">
            <h2 id="meditate-sessions" className="text-ink font-bold">
              Sessions
            </h2>
            <SessionList
              items={sessions.filter((s) => !s.forSurvivors)}
              onStart={(s) => setParams({ session: s.id })}
            />
          </section>
        </>
      )}
    </div>
  )
}
