import { Link } from 'react-router'

import { useMedicationStore } from '@/features/medication'

import { pharmacies } from '../partners'
import { StoreButtons } from './StoreButtons'

export function MedicineRefills() {
  const medications = useMedicationStore((s) => s.medications)

  if (medications.length === 0) {
    return (
      <p className="border-ink-muted/20 text-ink-muted rounded-2xl border-2 border-dashed p-4 text-center text-sm">
        Add your medicines in{' '}
        <Link to="/care?view=medication" className="text-pine font-semibold underline">
          Medication
        </Link>{' '}
        to reorder them here.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <ul className="divide-cream divide-y overflow-hidden rounded-3xl bg-white shadow-sm">
        {medications.map((m) => (
          <li key={m.id} className="space-y-2 p-4">
            <p className="text-ink font-bold">
              {m.name}
              {m.dosage && <span className="text-ink-muted font-normal"> · {m.dosage}</span>}
            </p>
            <StoreButtons ids={pharmacies} query={m.name} label={m.name} />
          </li>
        ))}
      </ul>
      <p className="text-ink-muted text-xs">
        Licensed online pharmacies. Prescription medicines need a valid prescription, which the
        pharmacy will ask you to upload. Always check the medicine and strength match your
        prescription.
      </p>
    </div>
  )
}
