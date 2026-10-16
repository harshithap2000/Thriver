import { useState, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'
import { Field, inputClass, TextAreaField } from '@/shared/ui/Field'
import { PlusIcon, TrashIcon } from '@/shared/ui/icons'

import { useMedicationStore } from '../useMedicationStore'

export function MedicationForm({ onDone }: { onDone: () => void }) {
  const addMedication = useMedicationStore((s) => s.addMedication)
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [times, setTimes] = useState(['08:00'])
  const [notes, setNotes] = useState('')

  const setTime = (index: number, value: string) =>
    setTimes((ts) => ts.map((t, i) => (i === index ? value : t)))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    addMedication({ name: name.trim(), dosage: dosage.trim(), times, notes: notes.trim() })
    onDone()
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="New medication"
      className="space-y-3 rounded-3xl bg-white p-5 shadow-sm"
    >
      <Field
        label="Medication name"
        placeholder="e.g. Sertraline"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={50}
      />
      <Field
        label="Dose"
        placeholder="e.g. 50 mg, 1 tablet"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        maxLength={40}
      />

      <fieldset className="space-y-2">
        <legend className="text-ink mb-1.5 text-sm font-semibold">Times each day</legend>
        {times.map((time, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(i, e.target.value)}
              required
              aria-label={`Dose time ${i + 1}`}
              className={inputClass}
            />
            {times.length > 1 && (
              <button
                type="button"
                onClick={() => setTimes((ts) => ts.filter((_, j) => j !== i))}
                aria-label={`Remove dose time ${i + 1}`}
                className="text-ink-muted hover:bg-move/40 hover:text-move-ink grid size-11 shrink-0 place-items-center rounded-xl"
              >
                <TrashIcon className="size-4" />
              </button>
            )}
          </div>
        ))}
        {times.length < 6 && (
          <button
            type="button"
            onClick={() => setTimes((ts) => [...ts, '20:00'])}
            className="text-pine hover:text-ink flex items-center gap-1.5 text-sm font-semibold"
          >
            <PlusIcon className="size-4" />
            Add another time
          </button>
        )}
      </fieldset>

      <TextAreaField
        label="Notes"
        placeholder="e.g. Take with food"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={200}
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" className="bg-pine hover:bg-ink">
          Save medication
        </Button>
      </div>
    </form>
  )
}
