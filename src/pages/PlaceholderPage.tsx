import type { ReactNode } from 'react'

/** Shared layout for tabs that aren't built yet. */
export function PlaceholderPage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="space-y-3">
      <h1 className="text-ink text-2xl font-extrabold">{title}</h1>
      <p className="text-ink-muted">Coming soon.</p>
      {children}
    </section>
  )
}
