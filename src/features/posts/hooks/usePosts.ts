import { queryOptions, useQuery } from '@tanstack/react-query'

import { postsApi } from '../api/postsApi'

/** Centralised query keys keep cache invalidation consistent across the feature. */
export const postKeys = {
  all: ['posts'] as const,
  list: (limit: number) => [...postKeys.all, 'list', { limit }] as const,
}

export const postsQueryOptions = (limit: number) =>
  queryOptions({
    queryKey: postKeys.list(limit),
    queryFn: () => postsApi.list({ limit }),
  })

export function usePosts(limit = 10) {
  return useQuery(postsQueryOptions(limit))
}
