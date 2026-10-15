import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/utils'

import type { Post } from '../types'
import { PostList } from './PostList'

const posts: Post[] = [
  { id: 1, userId: 1, title: 'first post', body: 'Hello world' },
  { id: 2, userId: 1, title: 'second post', body: 'Another one' },
]

function mockFetchOnce(response: Response) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response)
}

describe('PostList', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders posts returned by the API', async () => {
    const fetchSpy = mockFetchOnce(Response.json(posts))

    renderWithProviders(<PostList limit={2} />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading posts')
    expect(await screen.findByRole('heading', { name: 'first post' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'second post' })).toBeInTheDocument()
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain('/posts?_limit=2')
  })

  it('shows an error and recovers on retry', async () => {
    mockFetchOnce(new Response(null, { status: 404 }))

    renderWithProviders(<PostList />)

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load posts")

    mockFetchOnce(Response.json(posts))
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('heading', { name: 'first post' })).toBeInTheDocument()
  })
})
