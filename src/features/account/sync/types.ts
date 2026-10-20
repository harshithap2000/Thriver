/** One synced item, as stored in the `sync_items` table. */
export interface SyncRow {
  kind: string
  key: string
  data: unknown
  deleted: boolean
  /** ISO time the item changed on the device. */
  client_updated_at: string
  /** ISO time the server stored it (set by the server). */
  updated_at?: string
}

/** The server side of sync. The Supabase implementation is in remote.ts; tests use a fake. */
export interface SyncRemote {
  /** Upserts rows; returns what the server kept (a newer edit may win over ours). */
  push: (userId: string, rows: SyncRow[]) => Promise<SyncRow[]>
  /** Rows changed at or after `since` (all rows when null), oldest first. */
  pull: (userId: string, since: string | null) => Promise<SyncRow[]>
}

/** Connects one local store to sync: its items keyed by a stable id. */
export interface SyncAdapter {
  kind: string
  read: () => Record<string, unknown>
  /** Replaces the store's items. */
  write: (items: Record<string, unknown>) => void
  subscribe: (listener: () => void) => () => void
}

/** What the engine remembers between syncs (persisted on the device). */
export interface SyncMeta {
  /** The account this device's data belongs to; null until the first sync. */
  userId: string | null
  /** Latest server `updated_at` seen. */
  cursor: string | null
  /** Last synced value of every item, as stable JSON: kind → key → json. */
  shadow: Record<string, Record<string, string>>
}
