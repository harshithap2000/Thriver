import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default('https://jsonplaceholder.typicode.com'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

/** Validated, typed environment config. Import this instead of reading import.meta.env directly. */
export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
} as const
