import { useSearchParams } from 'react-router'

import { NoteComposer } from '@/features/family'

export default function FamilyWritePage() {
  const [params] = useSearchParams()
  const recipient = params.get('for')?.trim().slice(0, 30) || 'them'

  return (
    <div className="space-y-6">
      <header className="text-center">
        <p className="text-4xl" aria-hidden="true">
          💌
        </p>
        <h1 className="text-ink mt-2 text-2xl font-extrabold">Leave a note for {recipient}</h1>
        <p className="text-ink-muted">A few kind words can brighten someone&rsquo;s whole day.</p>
      </header>
      <NoteComposer recipient={recipient} />
    </div>
  )
}
