import { TrashIcon } from '@/shared/ui/icons'
import { formatTime } from '@/shared/utils/date'

import { useMedicationStore } from '../useMedicationStore'

export function MedicationList() {
  const medications = useMedicationStore((s) => s.medications)
  const removeMedication = useMedicationStore((s) => s.removeMedication)

  if (medications.length === 0) return null

  return (
    <ul className="divide-cream divide-y overflow-hidden rounded-3xl bg-white shadow-sm">
      {medications.map((m) => (
        <li key={m.id} className="flex items-start gap-3 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-ink font-bold">
              {m.name}
              {m.dosage && <span className="text-ink-muted font-normal"> · {m.dosage}</span>}
            </h3>
            <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label={`${m.name} times`}>
              {m.times.map((t) => (
                <li
                  key={t}
                  className="bg-reflect text-ink rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >
                  {formatTime(t)}
                </li>
              ))}
            </ul>
            {m.notes && <p className="text-ink-muted mt-1.5 text-sm italic">{m.notes}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove ${m.name}?`)) removeMedication(m.id)
            }}
            aria-label={`Remove ${m.name}`}
            className="text-ink-muted hover:bg-move/40 hover:text-move-ink grid size-9 shrink-0 place-items-center rounded-full"
          >
            <TrashIcon className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  )
}
