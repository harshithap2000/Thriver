import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'

import { CareDisclaimer } from '@/shared/ui/Notices'

import { findRoutine } from '../routines'
import { LogActivityForm } from './LogActivityForm'
import { RoutineList } from './RoutineList'
import { RoutinePlayer } from './RoutinePlayer'
import { TodayActivities } from './TodayActivities'
import { TodayProgress } from './TodayProgress'
import { WeekChart } from './WeekChart'

export function MoveHub({ plan }: { plan?: ReactNode }) {
  const [params, setParams] = useSearchParams()
  const active = findRoutine(params.get('routine'))

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">Move</h1>
        <p className="text-ink-muted">Gentle movement, at your own pace.</p>
      </header>

      {active ? (
        <RoutinePlayer key={active.id} routine={active} onExit={() => setParams({})} />
      ) : (
        <>
          <TodayProgress />

          {plan}

          <section aria-labelledby="routines-title" className="space-y-3">
            <h2 id="routines-title" className="text-ink font-bold">
              Guided routines
            </h2>
            <RoutineList onStart={(r) => setParams({ routine: r.id })} />
          </section>

          <section aria-labelledby="log-title" className="space-y-3">
            <h2 id="log-title" className="text-ink font-bold">
              Log an activity
            </h2>
            <LogActivityForm />
          </section>

          <section aria-labelledby="today-moves-title" className="space-y-3">
            <h2 id="today-moves-title" className="text-ink font-bold">
              Today
            </h2>
            <TodayActivities />
          </section>

          <section aria-labelledby="week-moves-title" className="space-y-3">
            <h2 id="week-moves-title" className="text-ink font-bold">
              This week
            </h2>
            <WeekChart />
          </section>

          <p className="text-ink-muted text-center text-xs">
            Move gently and stop if anything hurts. Check with your care team before starting new
            exercise.
          </p>
          <CareDisclaimer />
        </>
      )}
    </div>
  )
}
