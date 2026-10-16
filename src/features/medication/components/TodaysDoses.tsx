import { CheckIcon, PillIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'
import { dateKey, formatTime } from '@/shared/utils/date'

import { doseId, useMedicationStore } from '../useMedicationStore'

export function TodaysDoses() {
  const medications = useMedicationStore((s) => s.medications)
  const takenToday = useMedicationStore((s) => s.taken[dateKey()])
  const toggleDose = useMedicationStore((s) => s.toggleDose)

  const doses = medications
    .flatMap((m) => m.times.map((time) => ({ medication: m, time })))
    .sort((a, b) => a.time.localeCompare(b.time))
  const takenCount = doses.filter((d) => takenToday?.[doseId(d.medication.id, d.time)]).length

  if (doses.length === 0) {
    return (
      <p className="border-ink-muted/20 text-ink-muted rounded-2xl border-2 border-dashed p-4 text-center text-sm">
        Add a medication to see today&rsquo;s schedule.
      </p>
    )
  }

  const allDone = takenCount === doses.length

  return (
    <div className="space-y-3">
      <div className="bg-mint rounded-3xl p-4">
        <p className="text-ink font-bold" aria-live="polite">
          {allDone ? 'All done for today 🎉' : `${takenCount} of ${doses.length} doses taken`}
        </p>
        <div
          role="progressbar"
          aria-label="Doses taken today"
          aria-valuemin={0}
          aria-valuemax={doses.length}
          aria-valuenow={takenCount}
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-white"
        >
          <div
            className="bg-pine h-full rounded-full transition-[width] duration-300"
            style={{ width: `${(takenCount / doses.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {doses.map(({ medication, time }) => {
          const isTaken = Boolean(takenToday?.[doseId(medication.id, time)])
          const label = `${medication.name} at ${formatTime(time)}`
          return (
            <li key={doseId(medication.id, time)}>
              <button
                type="button"
                aria-pressed={isTaken}
                aria-label={`${label}: ${isTaken ? 'taken' : 'not taken'}`}
                onClick={() => toggleDose(medication.id, time)}
                className="hover:bg-mint/50 flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm transition-colors"
              >
                <span className="bg-sleep text-sleep-ink grid size-11 shrink-0 place-items-center rounded-xl">
                  <PillIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block font-bold',
                      isTaken ? 'text-ink-muted line-through' : 'text-ink',
                    )}
                  >
                    {medication.name}
                  </span>
                  <span className="text-ink-muted block text-sm">
                    {formatTime(time)}
                    {medication.dosage && ` · ${medication.dosage}`}
                  </span>
                </span>
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors',
                    isTaken
                      ? 'border-pine bg-pine text-white'
                      : 'border-ink-muted/30 text-transparent',
                  )}
                >
                  <CheckIcon className="size-4" />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
