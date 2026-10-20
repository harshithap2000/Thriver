import { stableJson } from './stableJson'
import type { SyncAdapter, SyncMeta, SyncRemote, SyncRow } from './types'

/** Pull a little before the cursor: rows committed slightly out of order are not missed. */
const OVERLAP_MS = 10_000
const PUSH_BATCH = 500

export class OtherAccountError extends Error {
  constructor() {
    super('This device holds data from a different account')
  }
}

interface Options {
  userId: string
  adapters: readonly SyncAdapter[]
  remote: SyncRemote
  meta: SyncMeta
  now?: () => Date
}

/**
 * One sync round. The device's stores are the source of truth for the UI (instant, offline);
 * this reconciles them with the server and returns the updated meta to persist.
 *
 * - First sync of an account on this device: pull everything, the backup wins for items that
 *   exist on both sides, then upload anything only on the device.
 * - Later syncs: push local changes (diffed against the shadow), then pull changes from other
 *   devices. A remote change is applied only if the item has no unsynced local edit; otherwise
 *   the local edit is pushed next round and the server keeps the latest (last write wins).
 */
export async function syncOnce({
  userId,
  adapters,
  remote,
  meta,
  now = () => new Date(),
}: Options): Promise<SyncMeta> {
  if (meta.userId && meta.userId !== userId) throw new OtherAccountError()
  const firstSync = meta.userId === null
  const shadow: SyncMeta['shadow'] = structuredClone(meta.shadow)
  let cursor = meta.cursor
  const byKind = new Map(adapters.map((a) => [a.kind, a]))

  const applyRemote = (rows: SyncRow[], force: boolean) => {
    const pending = new Map<string, Record<string, unknown>>()
    for (const row of rows) {
      const adapter = byKind.get(row.kind)
      if (row.updated_at && (!cursor || row.updated_at > cursor)) cursor = row.updated_at
      if (!adapter) continue // from a newer app version; ignored here
      const items = pending.get(row.kind) ?? adapter.read()
      const kindShadow = (shadow[row.kind] ??= {})
      const local = row.key in items ? stableJson(items[row.key]) : undefined
      const hasLocalEdit = local !== kindShadow[row.key]
      if (hasLocalEdit && !force) continue
      if (row.deleted) {
        delete items[row.key]
        delete kindShadow[row.key]
      } else {
        items[row.key] = row.data
        kindShadow[row.key] = stableJson(row.data)
      }
      pending.set(row.kind, items)
    }
    // Shadow is updated first, so the store change this causes isn't pushed back.
    for (const [kind, items] of pending) byKind.get(kind)!.write(items)
  }

  const pull = async (force: boolean) => {
    const since = cursor ? new Date(Date.parse(cursor) - OVERLAP_MS).toISOString() : null
    applyRemote(await remote.pull(userId, since), force)
  }

  const push = async () => {
    const stamp = now().toISOString()
    const rows: SyncRow[] = []
    const sent = new Map<string, string | null>()
    for (const adapter of adapters) {
      const items = adapter.read()
      const kindShadow = shadow[adapter.kind] ?? {}
      for (const [key, value] of Object.entries(items)) {
        const json = stableJson(value)
        if (kindShadow[key] === json) continue
        rows.push({
          kind: adapter.kind,
          key,
          data: value,
          deleted: false,
          client_updated_at: stamp,
        })
        sent.set(`${adapter.kind}\u0000${key}`, json)
      }
      for (const key of Object.keys(kindShadow)) {
        if (key in items) continue
        rows.push({ kind: adapter.kind, key, data: null, deleted: true, client_updated_at: stamp })
        sent.set(`${adapter.kind}\u0000${key}`, null)
      }
    }
    for (let i = 0; i < rows.length; i += PUSH_BATCH) {
      const kept = await remote.push(userId, rows.slice(i, i + PUSH_BATCH))
      const overruled: SyncRow[] = []
      for (const row of kept) {
        const ours = sent.get(`${row.kind}\u0000${row.key}`)
        const theirs = row.deleted ? null : stableJson(row.data)
        if (ours === theirs) {
          const kindShadow = (shadow[row.kind] ??= {})
          if (row.deleted) delete kindShadow[row.key]
          else kindShadow[row.key] = theirs!
        } else {
          overruled.push(row) // the server has a newer edit from another device
        }
      }
      applyRemote(overruled, true)
    }
  }

  if (firstSync) {
    await pull(true)
    await push()
  } else {
    await push()
    await pull(false)
  }

  return { userId, cursor, shadow }
}

/** Meta for a device that has never synced. */
export const emptyMeta = (): SyncMeta => ({ userId: null, cursor: null, shadow: {} })
