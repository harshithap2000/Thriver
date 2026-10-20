import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { env } from '@/shared/config/env'

/** Local storage key for the session, under the app's prefix so "delete everything" removes it. */
export const AUTH_STORAGE_KEY = 'thriver-auth'

/**
 * The Supabase client, or null when accounts aren't configured. Sessions are kept in local
 * storage and refreshed automatically; OAuth uses the PKCE flow (see /auth/callback).
 */
export const supabase: SupabaseClient | null = env.supabase
  ? createClient(env.supabase.url, env.supabase.key, {
      auth: {
        storageKey: AUTH_STORAGE_KEY,
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
