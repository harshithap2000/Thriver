import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { createId } from '@/shared/utils/id'

export interface Appointment {
  id: string
  title: string
  /** Doctor, therapist, clinic… */
  withWhom: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM, 24h */
  time: string
  location: string
  notes: string
}

export type NewAppointment = Omit<Appointment, 'id'>

interface AppointmentsState {
  appointments: Appointment[]
  addAppointment: (appointment: NewAppointment) => void
  removeAppointment: (id: string) => void
}

export const useAppointmentsStore = create<AppointmentsState>()(
  persist(
    (set) => ({
      appointments: [],
      addAppointment: (appointment) =>
        set((s) => ({ appointments: [...s.appointments, { ...appointment, id: createId() }] })),
      removeAppointment: (id) =>
        set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),
    }),
    { name: 'thriver-appointments' },
  ),
)

/** Chronological order: by date, then time. */
export const byDateTime = (a: Appointment, b: Appointment) =>
  `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
