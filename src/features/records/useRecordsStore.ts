import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { createId } from '@/shared/utils/id'

import type { CategoryId } from './categories'
import { deleteFile, saveFile } from './fileStore'

export interface HealthRecord {
  id: string
  title: string
  category: CategoryId
  /** Date on the document, YYYY-MM-DD */
  date: string
  /** Doctor, clinic, lab… */
  provider: string
  notes: string
  fileName: string
  mimeType: string
  size: number
  /** ISO timestamp */
  addedAt: string
}

export type NewRecord = Pick<HealthRecord, 'title' | 'category' | 'date' | 'provider' | 'notes'>

interface RecordsState {
  records: HealthRecord[]
  addRecord: (details: NewRecord, file: File) => Promise<HealthRecord>
  removeRecord: (id: string) => Promise<void>
}

export const useRecordsStore = create<RecordsState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: async (details, file) => {
        const record: HealthRecord = {
          ...details,
          id: createId(),
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          addedAt: new Date().toISOString(),
        }
        // Save the file first so a record never points at a missing file.
        await saveFile(record.id, file)
        set((s) => ({ records: [...s.records, record] }))
        return record
      },
      removeRecord: async (id) => {
        set((s) => ({ records: s.records.filter((r) => r.id !== id) }))
        await deleteFile(id)
      },
    }),
    { name: 'thriver-records' },
  ),
)

/** Newest document date first. */
export const byDocumentDate = (a: HealthRecord, b: HealthRecord) =>
  b.date.localeCompare(a.date) || b.addedAt.localeCompare(a.addedAt)
