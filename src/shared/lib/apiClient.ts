import type { z } from 'zod'

import { env } from '@/shared/config/env'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions<T> extends Omit<RequestInit, 'body'> {
  /** Zod schema used to validate and type the response body. */
  schema: z.ZodType<T>
  body?: unknown
}

async function request<T>(path: string, { schema, body, headers, ...init }: RequestOptions<T>) {
  const response = await fetch(new URL(path, env.apiBaseUrl), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${init.method ?? 'GET'} ${path} failed: ${response.status}`,
    )
  }

  return schema.parse(await response.json())
}

export const apiClient = {
  get: <T>(path: string, options: RequestOptions<T>) =>
    request(path, { ...options, method: 'GET' }),
  post: <T>(path: string, options: RequestOptions<T>) =>
    request(path, { ...options, method: 'POST' }),
  put: <T>(path: string, options: RequestOptions<T>) =>
    request(path, { ...options, method: 'PUT' }),
  delete: <T>(path: string, options: RequestOptions<T>) =>
    request(path, { ...options, method: 'DELETE' }),
}
