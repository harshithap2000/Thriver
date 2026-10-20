import { useAuthStore } from '../useAuthStore'
import { OtherAccountError, syncOnce } from './engine'
import type { SyncAdapter, SyncRemote } from './types'
import { useSyncStore } from './useSyncStore'

const DEBOUNCE_MS = 1500
const INTERVAL_MS = 60_000

interface RunnerOptions {
  remote: SyncRemote
  adapters: readonly SyncAdapter[]
}

/**
 * Runs sync in the background while someone is signed in: soon after any local change, when
 * the app comes back into view or online, and every minute while it is open. Only one round
 * runs at a time; changes made during a round trigger another.
 */
export function createSyncRunner({ remote, adapters }: RunnerOptions) {
  let running: Promise<void> | null = null
  let again = false
  let timer: ReturnType<typeof setTimeout> | undefined

  const round = async () => {
    const userId = useAuthStore.getState().user?.id
    if (!userId) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      useSyncStore.setState({ status: 'offline' })
      return
    }
    useSyncStore.setState({ status: 'syncing', error: null })
    try {
      const meta = await syncOnce({ userId, adapters, remote, meta: useSyncStore.getState().meta })
      useSyncStore.setState({ meta, status: 'idle', lastSyncedAt: new Date().toISOString() })
    } catch (error) {
      if (error instanceof OtherAccountError) useSyncStore.setState({ status: 'otherAccount' })
      else
        useSyncStore.setState({
          status: navigator.onLine === false ? 'offline' : 'error',
          error: error instanceof Error ? error.message : String(error),
        })
    }
  }

  /** Syncs now (or right after the round in progress) and resolves when done. */
  const syncNow = (): Promise<void> => {
    clearTimeout(timer)
    if (running) {
      again = true
      return running
    }
    running = (async () => {
      do {
        again = false
        await round()
      } while (again)
    })().finally(() => {
      running = null
    })
    return running
  }

  const soon = () => {
    if (!useAuthStore.getState().user) return
    clearTimeout(timer)
    timer = setTimeout(() => void syncNow(), DEBOUNCE_MS)
  }

  /** Starts listening; returns a function that stops everything. */
  const start = () => {
    const stops = adapters.map((a) => a.subscribe(soon))
    const onVisible = () => {
      if (document.visibilityState === 'visible') void syncNow()
    }
    const onOnline = () => void syncNow()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('online', onOnline)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && useAuthStore.getState().user) void syncNow()
    }, INTERVAL_MS)
    const stopAuth = useAuthStore.subscribe((state, previous) => {
      if (state.user?.id && state.user.id !== previous.user?.id) void syncNow()
    })
    return () => {
      stops.forEach((stop) => stop())
      stopAuth()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('online', onOnline)
      clearInterval(interval)
      clearTimeout(timer)
    }
  }

  return { syncNow, start }
}

export type SyncRunner = ReturnType<typeof createSyncRunner>
