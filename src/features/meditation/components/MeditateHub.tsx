import { useSearchParams } from 'react-router'

import { findSession } from '../sessions'
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
          <section aria-labelledby="meditate-sessions" className="space-y-3">
            <h2 id="meditate-sessions" className="text-ink font-bold">
              Sessions
            </h2>
            <SessionList onStart={(s) => setParams({ session: s.id })} />
          </section>
        </>
      )}
    </div>
  )
}
