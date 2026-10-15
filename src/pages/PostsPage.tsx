import { PostList } from '@/features/posts'

export default function PostsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      <PostList />
    </section>
  )
}
