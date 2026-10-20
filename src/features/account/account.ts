import type { SupabaseClient } from '@supabase/supabase-js'

import { deleteAllFiles } from '@/features/records'
import { env } from '@/shared/config/env'
import { AUTH_STORAGE_KEY, supabase } from '@/shared/lib/supabase'

import { syncAdapters } from './sync/registry'
import { supabaseRemote } from './sync/remote'
import { createSyncRunner, type SyncRunner } from './sync/runner'
import { useAuthStore, userFromSession } from './useAuthStore'

/** Every app setting and entry lives in localStorage under this prefix (session included). */
export const STORAGE_PREFIX = 'thriver-'
const NEXT_KEY = 'thriver-next'

let runner: SyncRunner | null = null

/**
 * Starts accounts and background sync. Call once when the app starts. Without Supabase config
 * the app keeps working on-device only.
 */
export function startAccount(client: SupabaseClient | null = supabase) {
  if (!client) {
    useAuthStore.setState({ status: 'unconfigured', user: null })
    return () => {}
  }
  runner = createSyncRunner({ remote: supabaseRemote(client), adapters: syncAdapters })
  const stopRunner = runner.start()
  void client.auth.getSession().then(({ data }) => {
    const user = userFromSession(data.session)
    useAuthStore.setState({ status: user ? 'signedIn' : 'signedOut', user })
  })
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    const user = userFromSession(session)
    // Deferred: Supabase advises against calling it again inside this callback.
    setTimeout(() => useAuthStore.setState({ status: user ? 'signedIn' : 'signedOut', user }), 0)
  })
  return () => {
    data.subscription.unsubscribe()
    stopRunner()
  }
}

/** Syncs now if someone is signed in (resolves when the round finishes). */
export const syncNow = () => runner?.syncNow() ?? Promise.resolve()

const requireClient = () => {
  if (!supabase) throw new Error('Accounts aren’t set up on this version of Thriver')
  return supabase
}

export type OAuthProvider = 'google' | 'apple'

/** Which sign-in methods the Supabase project has turned on. */
export async function enabledProviders(): Promise<{
  google: boolean
  apple: boolean
  phone: boolean
}> {
  if (!env.supabase) return { google: false, apple: false, phone: false }
  const res = await fetch(`${env.supabase.url}/auth/v1/settings`, {
    headers: { apikey: env.supabase.key },
  })
  if (!res.ok) throw new Error('Couldn’t reach the sign-in service')
  const body = (await res.json()) as { external?: Record<string, boolean> }
  return {
    google: Boolean(body.external?.google),
    apple: Boolean(body.external?.apple),
    phone: Boolean(body.external?.phone),
  }
}

/** Sends the person to Google or Apple; they come back to /auth/callback. */
export async function signInWithProvider(provider: OAuthProvider, next: string) {
  sessionStorage.setItem(NEXT_KEY, next)
  const { error } = await requireClient().auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // On shared family phones, always let people choose their own Google account.
      queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
    },
  })
  if (error) throw new Error(error.message)
}

/** Where to go after the OAuth round trip. */
export function takeNext() {
  const next = sessionStorage.getItem(NEXT_KEY)
  sessionStorage.removeItem(NEXT_KEY)
  return next?.startsWith('/') ? next : '/'
}

/** "98765 43210" → "+919876543210". India by default; other countries with a leading +. */
export function normalisePhone(input: string) {
  const trimmed = input.replace(/[\s()-]/g, '')
  if (/^\+\d{8,15}$/.test(trimmed)) return trimmed
  const digits = trimmed.replace(/^0/, '')
  return /^\d{10}$/.test(digits) ? `+91${digits}` : null
}

/** Supabase error text → words for patients. */
export function friendlyAuthError(message: string) {
  const wait = /after (\d+) seconds?/.exec(message)
  if (wait) return `Please wait ${wait[1]} seconds, then ask for a new code.`
  if (/expired|invalid/i.test(message) && /token|otp/i.test(message))
    return 'That code didn’t work. Check it, or ask for a new one.'
  if (/rate limit/i.test(message)) return 'Too many tries. Please wait a few minutes.'
  return message
}

export async function sendPhoneCode(phone: string) {
  const { error } = await requireClient().auth.signInWithOtp({ phone })
  if (error) throw new Error(friendlyAuthError(error.message))
}

export async function verifyPhoneCode(phone: string, token: string) {
  const { data, error } = await requireClient().auth.verifyOtp({ phone, token, type: 'sms' })
  if (error) throw new Error(friendlyAuthError(error.message))
  useAuthStore.setState({ status: 'signedIn', user: userFromSession(data.session) })
}

/**
 * Removes all of Thriver's data from this device (not from the backup). With `keepSession`, the
 * person stays signed in. Reload the page afterwards so in-memory state is cleared too.
 */
export async function wipeLocalData({ keepSession = false } = {}) {
  for (const key of Object.keys(localStorage)) {
    if (keepSession && key === AUTH_STORAGE_KEY) continue
    if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key)
  }
  await deleteAllFiles()
}

/**
 * Signs out on this device after a last sync. With `removeLocalData`, also clears the device
 * (for shared phones); otherwise the data stays here and syncs again on the next sign-in.
 */
export async function signOut({ removeLocalData = false } = {}) {
  const client = requireClient()
  await syncNow()
  await client.auth.signOut({ scope: 'local' })
  useAuthStore.setState({ status: 'signedOut', user: null })
  if (removeLocalData) await wipeLocalData()
}

/** Deletes the account and its backup on the server, then everything on this device. */
export async function deleteAccountEverywhere() {
  const client = requireClient()
  const { error } = await client.rpc('delete_my_account')
  if (error) throw new Error(error.message)
  await client.auth.signOut({ scope: 'local' })
  useAuthStore.setState({ status: 'signedOut', user: null })
  await wipeLocalData()
}
