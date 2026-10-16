import { useState, type ChangeEvent, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'
import { Field, inputClass, TextAreaField } from '@/shared/ui/Field'
import { dateKey } from '@/shared/utils/date'

import {
  ACCEPTED_TYPES,
  categories,
  formatBytes,
  MAX_FILE_BYTES,
  type CategoryId,
} from '../categories'
import { useRecordsStore } from '../useRecordsStore'

const titleFromFileName = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .slice(0, 80)

export function AddRecordForm({ onDone }: { onDone: () => void }) {
  const addRecord = useRecordsStore((s) => s.addRecord)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<CategoryId>('lab')
  const [date, setDate] = useState(dateKey())
  const [provider, setProvider] = useState('')
  const [notes, setNotes] = useState('')

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    setError('')
    if (!picked) return setFile(null)
    if (!(ACCEPTED_TYPES as readonly string[]).includes(picked.type)) {
      setFile(null)
      return setError('Please choose a PDF or a photo (JPEG, PNG, WebP or GIF).')
    }
    if (picked.size > MAX_FILE_BYTES) {
      setFile(null)
      return setError(
        `That file is ${formatBytes(picked.size)}. The limit is ${formatBytes(MAX_FILE_BYTES)}.`,
      )
    }
    setFile(picked)
    if (!title) setTitle(titleFromFileName(picked.name))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) return setError('Choose a file to save.')
    setSaving(true)
    try {
      await addRecord(
        { title: title.trim(), category, date, provider: provider.trim(), notes: notes.trim() },
        file,
      )
      onDone()
    } catch {
      setError("Couldn't save the file on this device. It may be out of storage space.")
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      aria-label="Add record"
      className="space-y-3 rounded-3xl bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="record-file" className="text-ink text-sm font-semibold">
          Document or photo
        </label>
        <input
          id="record-file"
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFile}
          className="text-ink file:bg-mint file:text-pine text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-2 file:font-semibold"
        />
        {file && (
          <p className="text-ink-muted text-xs">
            {file.name} · {formatBytes(file.size)}
          </p>
        )}
        {error && (
          <p className="text-move-ink text-sm font-semibold" role="alert">
            {error}
          </p>
        )}
      </div>

      <Field
        label="Title"
        placeholder="e.g. Full blood count"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={80}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="record-category" className="text-ink text-sm font-semibold">
            Type
          </label>
          <select
            id="record-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Date on document"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <Field
        label="From"
        placeholder="Doctor, clinic or lab"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        maxLength={80}
      />
      <TextAreaField
        label="Notes"
        placeholder="Anything to remember about this record"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={500}
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} className="bg-pine hover:bg-ink">
          {saving ? 'Saving…' : 'Save record'}
        </Button>
      </div>
    </form>
  )
}
