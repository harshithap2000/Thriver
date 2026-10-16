import { Link } from 'react-router'

import { cn } from '@/shared/utils/cn'
import { parseDateKey } from '@/shared/utils/date'

import { categoryInfo, recordDate } from '../categories'
import type { HealthRecord } from '../useRecordsStore'

export function RecordCard({ record }: { record: HealthRecord }) {
  const info = categoryInfo(record.category)
  return (
    <Link
      to={`/records/${record.id}`}
      className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <span
        className={cn('grid size-12 shrink-0 place-items-center rounded-2xl text-2xl', info.tile)}
        aria-hidden="true"
      >
        {info.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-ink block truncate font-bold">{record.title}</span>
        <span className="text-ink-muted block truncate text-sm">
          {recordDate.format(parseDateKey(record.date))}
          {record.provider && ` · ${record.provider}`}
        </span>
      </span>
      <span className="bg-cream text-ink-muted shrink-0 rounded-full px-2 py-0.5 text-xs font-bold">
        {record.mimeType === 'application/pdf' ? 'PDF' : 'Photo'}
      </span>
    </Link>
  )
}
