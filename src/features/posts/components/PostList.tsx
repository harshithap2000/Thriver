import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

import { usePosts } from '../hooks/usePosts'

export function PostList({ limit = 10 }: { limit?: number }) {
  const { data: posts, isPending, isError, error, refetch } = usePosts(limit)

  if (isPending) return <Spinner label="Loading posts…" />

  if (isError) {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-red-600">Couldn't load posts: {error.message}</p>
        <Button variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  if (posts.length === 0) return <p className="text-slate-500">No posts yet.</p>

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <li key={post.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="font-semibold capitalize">{post.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
            {post.body}
          </p>
        </li>
      ))}
    </ul>
  )
}
