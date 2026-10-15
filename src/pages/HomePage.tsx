import { Link } from 'react-router'

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to Thriver</h1>
      <p className="max-w-prose text-slate-600 dark:text-slate-400">
        A scalable React starter: Vite, TypeScript, Tailwind CSS, React Router, TanStack Query and
        Zustand, organised by feature.
      </p>
      <Link
        to="/posts"
        className="bg-brand-600 hover:bg-brand-700 inline-block rounded-md px-4 py-2 text-sm font-medium text-white"
      >
        See the example feature →
      </Link>
    </section>
  )
}
