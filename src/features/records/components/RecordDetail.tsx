import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { ChevronLeftIcon, DownloadIcon, SparklesIcon, TrashIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'
import { parseDateKey } from '@/shared/utils/date'

import { categoryInfo, formatBytes, recordDate } from '../categories'
import { loadFile } from '../fileStore'
import { useRecordsStore } from '../useRecordsStore'

export function RecordDetail({ id }: { id: string }) {
  const record = useRecordsStore((s) => s.records.find((r) => r.id === id))
  const removeRecord = useRecordsStore((s) => s.removeRecord)
  const navigate = useNavigate()
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let url: string | null = null
    let cancelled = false
    void loadFile(id).then((blob) => {
      if (cancelled) return
      if (!blob) return setMissing(true)
      url = URL.createObjectURL(blob)
      setFileUrl(url)
    })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [id])

  if (!record) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-ink font-bold">Record not found</p>
        <Link to="/records" className="text-pine font-semibold underline">
          Back to records
        </Link>
      </div>
    )
  }

  const info = categoryInfo(record.category)
  const isPdf = record.mimeType === 'application/pdf'

  return (
    <div className="space-y-5">
      <Link
        to="/records"
        className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
      >
        <ChevronLeftIcon className="size-4" /> Records
      </Link>

      <header className="flex items-start gap-4">
        <span
          className={cn('grid size-14 shrink-0 place-items-center rounded-2xl text-3xl', info.tile)}
          aria-hidden="true"
        >
          {info.emoji}
        </span>
        <div className="min-w-0">
          <h1 className="text-ink text-2xl leading-tight font-extrabold">{record.title}</h1>
          <p className="text-ink-muted">
            {info.label} · {recordDate.format(parseDateKey(record.date))}
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {missing ? (
          <p className="text-ink-muted p-6 text-center text-sm">
            The file for this record is missing on this device.
          </p>
        ) : !fileUrl ? (
          <p className="text-ink-muted p-6 text-center text-sm">Loading…</p>
        ) : isPdf ? (
          <iframe src={fileUrl} title={record.title} className="h-96 w-full" />
        ) : (
          <img src={fileUrl} alt={record.title} className="max-h-[28rem] w-full object-contain" />
        )}
      </div>

      {fileUrl && (
        <div className="grid grid-cols-2 gap-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:bg-mint rounded-xl bg-white px-3 py-2.5 text-center text-sm font-bold shadow-sm"
          >
            Open full size
          </a>
          <a
            href={fileUrl}
            download={record.fileName}
            className="text-ink hover:bg-mint flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-bold shadow-sm"
          >
            <DownloadIcon className="size-4" /> Download
          </a>
        </div>
      )}

      <Link
        to={`/records/assistant?about=${encodeURIComponent(record.id)}`}
        className="bg-pine hover:bg-ink flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white shadow-sm"
      >
        <SparklesIcon className="size-5" /> Explain this record
      </Link>

      <dl className="divide-cream divide-y rounded-3xl bg-white text-sm shadow-sm">
        {[
          ['From', record.provider || '—'],
          ['File', `${record.fileName} · ${formatBytes(record.size)}`],
          ['Added', new Date(record.addedAt).toLocaleDateString()],
          ...(record.notes ? [['Notes', record.notes] as const] : []),
        ].map(([label, value]) => (
          <div key={label} className="flex gap-4 px-5 py-3">
            <dt className="text-ink-muted w-16 shrink-0 font-semibold">{label}</dt>
            <dd className="text-ink min-w-0 break-words whitespace-pre-wrap">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${record.title}" from this device? This cannot be undone.`)) {
            void removeRecord(record.id).then(() => navigate('/records'))
          }
        }}
        className="text-move-ink hover:bg-move/30 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
      >
        <TrashIcon className="size-4" /> Delete record
      </button>
    </div>
  )
}
