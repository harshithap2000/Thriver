import { useJournalStore } from '../useJournalStore'
import { JournalComposer } from './JournalComposer'
import { JournalEntries } from './JournalEntries'

export function JournalHub() {
  const count = useJournalStore((s) => s.entries.length)

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">Journal</h1>
        <p className="text-ink-muted">
          {count > 0
            ? `${count} entr${count === 1 ? 'y' : 'ies'} · private to this device`
            : 'A private space for your thoughts.'}
        </p>
      </header>

      <JournalComposer />

      <section aria-labelledby="entries-title" className="space-y-3">
        <h2 id="entries-title" className="text-ink font-bold">
          Past entries
        </h2>
        <JournalEntries />
      </section>
    </div>
  )
}
