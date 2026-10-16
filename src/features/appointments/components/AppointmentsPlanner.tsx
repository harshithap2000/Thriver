import { useMemo, useState } from 'react'

import { PlusIcon } from '@/shared/ui/icons'
import { dateKey, parseDateKey } from '@/shared/utils/date'

import { byDateTime, useAppointmentsStore } from '../useAppointmentsStore'
import { AppointmentCard } from './AppointmentCard'
import { AppointmentForm } from './AppointmentForm'
import { MonthCalendar } from './MonthCalendar'

const selectedTitle = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

export function AppointmentsPlanner() {
  const appointments = useAppointmentsStore((s) => s.appointments)
  const [selected, setSelected] = useState(() => dateKey())
  const [isAdding, setIsAdding] = useState(false)
  const today = dateKey()

  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const a of appointments) result[a.date] = (result[a.date] ?? 0) + 1
    return result
  }, [appointments])

  const sorted = useMemo(() => [...appointments].sort(byDateTime), [appointments])
  const onSelectedDay = sorted.filter((a) => a.date === selected)
  const upcoming = sorted.filter((a) => a.date >= today && a.date !== selected).slice(0, 5)

  return (
    <div className="space-y-7">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-extrabold">Appointments</h1>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-pine hover:bg-ink flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm"
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        )}
      </header>

      {isAdding && (
        <AppointmentForm
          defaultDate={selected}
          onDone={(saved) => {
            setIsAdding(false)
            if (saved) setSelected(saved.date)
          }}
        />
      )}

      <section aria-label="Calendar" className="rounded-3xl bg-white p-4 shadow-sm">
        {/* Remount on selection jumps (e.g. saving into another month) so the visible month follows. */}
        <MonthCalendar
          key={selected.slice(0, 7)}
          selected={selected}
          onSelect={setSelected}
          counts={counts}
        />
      </section>

      <section aria-labelledby="day-title" className="space-y-3">
        <h2 id="day-title" className="text-ink font-bold">
          {selected === today ? 'Today' : selectedTitle.format(parseDateKey(selected))}
        </h2>
        {onSelectedDay.length > 0 ? (
          onSelectedDay.map((a) => <AppointmentCard key={a.id} appointment={a} />)
        ) : (
          <p className="border-ink-muted/20 text-ink-muted rounded-2xl border-2 border-dashed p-4 text-center text-sm">
            Nothing planned.
          </p>
        )}
      </section>

      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-title" className="space-y-3">
          <h2 id="upcoming-title" className="text-ink font-bold">
            Upcoming
          </h2>
          {upcoming.map((a) => (
            <AppointmentCard key={a.id} appointment={a} showDate />
          ))}
        </section>
      )}
    </div>
  )
}
