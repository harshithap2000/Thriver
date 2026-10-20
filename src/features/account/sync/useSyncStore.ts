import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { emptyMeta } from './engine'
import type { SyncMeta } from './types'

export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error' | 'otherAccount'

interface SyncState {
  meta: SyncMeta
  /** ISO time of the last successful sync. */
  lastSyncedAt: string | null
  status: SyncStatus
  error: string | null
}

/** Sync bookkeeping. The meta (shadow copy, cursor, owner) is persisted; the status is not. */
export const useSyncStore = create<SyncState>()(
  persist(
    () => ({
      meta: emptyMeta(),
      lastSyncedAt: null as string | null,
      status: 'idle' as SyncStatus,
      error: null as string | null,
    }),
    {
      name: 'thriver-sync',
      partialize: ({ meta, lastSyncedAt }) => ({ meta, lastSyncedAt }),
    },
  ),
)
