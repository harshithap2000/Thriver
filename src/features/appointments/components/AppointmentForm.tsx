import { useState, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'
import { Field, TextAreaField } from '@/shared/ui/Field'

import { useAppointmentsStore, type NewAppointment } from '../useAppointmentsStore'

interface AppointmentFormProps {
  /** Pre-filled date (YYYY-MM-DD). */
  defaultDate: string
  onDone: (saved?: NewAppointment) => void
}

export function AppointmentForm({ defaultDate, onDone }: AppointmentFormProps) {
  const addAppointment = useAppointmentsStore((s) => s.addAppointment)
  const [form, setForm] = useState<NewAppointment>({
    title: '',
    withWhom: '',
    date: defaultDate,
    time: '09:00',
    location: '',
    notes: '',
  })

  const update = (field: keyof NewAppointment) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const appointment = {
      ...form,
      title: form.title.trim(),
      withWhom: form.withWhom.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
    }
    addAppointment(appointment)
    onDone(appointment)
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="New appointment"
      className="space-y-3 rounded-3xl bg-white p-5 shadow-sm"
    >
      <Field
        label="What is it?"
        placeholder="e.g. Therapy session"
        value={form.title}
        onChange={update('title')}
        required
        maxLength={60}
      />
      <Field
        label="With"
        placeholder="e.g. Dr. Patel"
        value={form.withWhom}
        onChange={update('withWhom')}
        maxLength={60}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" type="date" value={form.date} onChange={update('date')} required />
        <Field label="Time" type="time" value={form.time} onChange={update('time')} required />
      </div>
      <Field
        label="Location"
        placeholder="Clinic, address or video call"
        value={form.location}
        onChange={update('location')}
        maxLength={80}
      />
      <TextAreaField
        label="Notes"
        placeholder="Anything to remember or bring"
        value={form.notes}
        onChange={update('notes')}
        maxLength={200}
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={() => onDone()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-pine hover:bg-ink">
          Save appointment
        </Button>
      </div>
    </form>
  )
}
