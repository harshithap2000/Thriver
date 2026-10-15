import { z } from 'zod'

import { apiClient } from '@/shared/lib/apiClient'

import { postSchema } from '../types'

export const postsApi = {
  list: (params: { limit: number }) =>
    apiClient.get(`/posts?_limit=${params.limit}`, { schema: z.array(postSchema) }),
}
