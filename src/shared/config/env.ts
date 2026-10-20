import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default('https://jsonplaceholder.typicode.com'),
  // Supabase (accounts and backup). Both optional: without them the app runs on-device only.
  VITE_SUPABASE_URL: z.url().optional(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(20).optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

const { VITE_SUPABASE_URL: supabaseUrl, VITE_SUPABASE_PUBLISHABLE_KEY: supabaseKey } = parsed.data

/** Validated, typed environment config. Import this instead of reading import.meta.env directly. */
export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  /** Null when accounts aren't configured. */
  supabase: supabaseUrl && supabaseKey ? { url: supabaseUrl, key: supabaseKey } : null,
} as const
