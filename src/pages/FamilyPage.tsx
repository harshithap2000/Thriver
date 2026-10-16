import { InviteFamily, NotesWall } from '@/features/family'

export default function FamilyPage() {
  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">From your family</h1>
        <p className="text-ink-muted">Little notes from the people who love you.</p>
      </header>
      <InviteFamily />
      <NotesWall />
    </div>
  )
}
