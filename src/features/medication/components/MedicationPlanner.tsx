import { useState } from 'react'

import { PlusIcon } from '@/shared/ui/icons'

import { useMedicationStore } from '../useMedicationStore'
import { MedicationForm } from './MedicationForm'
import { MedicationList } from './MedicationList'
import { TodaysDoses } from './TodaysDoses'

export function MedicationPlanner() {
  const hasMedications = useMedicationStore((s) => s.medications.length > 0)
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="space-y-7">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-extrabold">Medication</h1>
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

      {isAdding && <MedicationForm onDone={() => setIsAdding(false)} />}

      <section aria-labelledby="today-doses-title" className="space-y-3">
        <h2 id="today-doses-title" className="text-ink font-bold">
          Today
        </h2>
        <TodaysDoses />
      </section>

      {hasMedications && (
        <section aria-labelledby="medications-title" className="space-y-3">
          <h2 id="medications-title" className="text-ink font-bold">
            Your medications
          </h2>
          <MedicationList />
        </section>
      )}

      <p className="text-ink-muted text-center text-xs">
        Thriver is a reminder aid, not medical advice. Always follow your prescriber&rsquo;s
        instructions.
      </p>
    </div>
  )
}
