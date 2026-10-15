import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-slate-500">This page doesn't exist.</p>
      <Link to="/" className="text-brand-600 underline">
        Go home
      </Link>
    </section>
  )
}
