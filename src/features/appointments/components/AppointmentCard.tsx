import { ClockIcon, MapPinIcon, TrashIcon } from '@/shared/ui/icons'
import { formatTime, parseDateKey } from '@/shared/utils/date'

import { useAppointmentsStore, type Appointment } from '../useAppointmentsStore'

const shortDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

export function AppointmentCard({
  appointment,
  showDate = false,
}: {
  appointment: Appointment
  showDate?: boolean
}) {
  const removeAppointment = useAppointmentsStore((s) => s.removeAppointment)
  const { id, title, withWhom, date, time, location, notes } = appointment

  const handleDelete = () => {
    if (window.confirm(`Delete "${title}"?`)) removeAppointment(id)
  }

  return (
    <article className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="bg-sleep w-1 shrink-0 rounded-full" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-ink leading-snug font-bold">{title}</h3>
        {withWhom && <p className="text-ink text-sm">{withWhom}</p>}
        <p className="text-ink-muted flex items-center gap-1.5 text-sm">
          <ClockIcon className="size-4 shrink-0" />
          {showDate && `${shortDate.format(parseDateKey(date))} · `}
          {formatTime(time)}
        </p>
        {location && (
          <p className="text-ink-muted flex items-center gap-1.5 text-sm">
            <MapPinIcon className="size-4 shrink-0" />
            {location}
          </p>
        )}
        {notes && <p className="text-ink-muted pt-1 text-sm italic">{notes}</p>}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Delete ${title}`}
        className="text-ink-muted hover:bg-move/40 hover:text-move-ink grid size-9 shrink-0 place-items-center self-start rounded-full"
      >
        <TrashIcon className="size-4" />
      </button>
    </article>
  )
}
