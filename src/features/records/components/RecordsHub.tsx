import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { inputClass } from '@/shared/ui/Field'
import { PlusIcon, SearchIcon, SparklesIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { categories, type CategoryId } from '../categories'
import { byDocumentDate, useRecordsStore } from '../useRecordsStore'
import { AddRecordForm } from './AddRecordForm'
import { RecordCard } from './RecordCard'

export function RecordsHub() {
  const records = useRecordsStore((s) => s.records)
  const [isAdding, setIsAdding] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records
      .filter((r) => category === 'all' || r.category === category)
      .filter(
        (r) =>
          !q ||
          [r.title, r.provider, r.notes, r.fileName, r.date].some((v) =>
            v.toLowerCase().includes(q),
          ),
      )
      .sort(byDocumentDate)
  }, [records, query, category])

  const usedCategories = categories.filter((c) => records.some((r) => r.category === c.id))

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-ink text-2xl font-extrabold">Records</h1>
          <p className="text-ink-muted">Your health documents, kept on this device.</p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-pine hover:bg-ink flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm"
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        )}
      </header>

      {isAdding && <AddRecordForm onDone={() => setIsAdding(false)} />}

      <Link
        to="/records/assistant"
        className="flex items-center gap-4 rounded-3xl bg-linear-to-r from-[#e1efe1] to-[#ddd5f6] p-4 shadow-sm"
      >
        <span className="text-sleep-ink grid size-12 shrink-0 place-items-center rounded-2xl bg-white/80">
          <SparklesIcon className="size-6" />
        </span>
        <span className="min-w-0">
          <span className="text-ink block font-bold">Ask about your records</span>
          <span className="text-ink-muted block text-sm">
            Find results and get them explained in plain words
          </span>
        </span>
      </Link>

      {records.length === 0 ? (
        <div className="border-ink-muted/20 rounded-3xl border-2 border-dashed p-6 text-center">
          <p className="text-3xl" aria-hidden="true">
            🗂️
          </p>
          <p className="text-ink mt-2 font-semibold">No records yet</p>
          <p className="text-ink-muted text-sm">
            Save lab results, scans, prescriptions and letters as PDFs or photos.
          </p>
        </div>
      ) : (
        <section aria-label="Your records" className="space-y-3">
          <div className="relative">
            <SearchIcon className="text-ink-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records"
              aria-label="Search records"
              className={cn(inputClass, 'pl-10')}
            />
          </div>
          {usedCategories.length > 1 && (
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
              {[{ id: 'all' as const, label: 'All', emoji: '' }, ...usedCategories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold',
                    category === c.id ? 'bg-pine text-white' : 'text-ink bg-white shadow-sm',
                  )}
                >
                  {c.emoji && <span aria-hidden="true">{c.emoji} </span>}
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {visible.length === 0 ? (
            <p className="text-ink-muted text-center text-sm">No records match.</p>
          ) : (
            <ul className="space-y-3">
              {visible.map((r) => (
                <li key={r.id}>
                  <RecordCard record={r} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
