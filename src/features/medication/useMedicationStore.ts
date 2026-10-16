import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { dateKey } from '@/shared/utils/date'
import { createId } from '@/shared/utils/id'

export interface Medication {
  id: string
  name: string
  /** Free text, e.g. "10 mg" or "1 tablet". */
  dosage: string
  /** Daily dose times as HH:MM (24h), sorted. */
  times: string[]
  notes: string
}

export type NewMedication = Omit<Medication, 'id'>

/** Identifies one scheduled dose within a day. */
export const doseId = (medicationId: string, time: string) => `${medicationId}@${time}`

interface MedicationState {
  medications: Medication[]
  /** Doses taken, by date (YYYY-MM-DD) then doseId → ISO time it was marked. */
  taken: Record<string, Record<string, string>>
  addMedication: (medication: NewMedication) => void
  removeMedication: (id: string) => void
  toggleDose: (medicationId: string, time: string, date?: string) => void
}

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set) => ({
      medications: [],
      taken: {},
      addMedication: (medication) =>
        set((s) => ({
          medications: [
            ...s.medications,
            { ...medication, id: createId(), times: [...new Set(medication.times)].sort() },
          ],
        })),
      removeMedication: (id) =>
        set((s) => ({ medications: s.medications.filter((m) => m.id !== id) })),
      toggleDose: (medicationId, time, date = dateKey()) =>
        set((s) => {
          const day = { ...s.taken[date] }
          const key = doseId(medicationId, time)
          if (day[key]) delete day[key]
          else day[key] = new Date().toISOString()
          return { taken: { ...s.taken, [date]: day } }
        }),
    }),
    { name: 'thriver-medication' },
  ),
)
