import type { StoreApi, UseBoundStore } from 'zustand'

import type { SyncAdapter } from './types'

type Store<S> = UseBoundStore<StoreApi<S>>

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/** A store field holding a list of items, each with a stable id. Keeps the list's order. */
export function listAdapter<S, T>(
  kind: string,
  store: Store<S>,
  field: keyof S & string,
  keyOf: (item: T) => string,
): SyncAdapter {
  const list = () => store.getState()[field] as T[]
  return {
    kind,
    read: () => Object.fromEntries(list().map((item) => [keyOf(item), item])),
    write: (items) => {
      const kept = list().filter((item) => keyOf(item) in items)
      const keptKeys = new Set(kept.map(keyOf))
      const next = [
        ...kept.map((item) => items[keyOf(item)] as T),
        ...Object.entries(items)
          .filter(([key, value]) => !keptKeys.has(key) && isObject(value))
          .map(([, value]) => value as T),
      ]
      store.setState({ [field]: next } as Partial<S>)
    },
    subscribe: (listener) =>
      store.subscribe((state, previous) => {
        if (state[field] !== previous[field]) listener()
      }),
  }
}

/** A store field holding a record keyed by id or date, e.g. check-ins by day. */
export function recordAdapter<S>(
  kind: string,
  store: Store<S>,
  field: keyof S & string,
): SyncAdapter {
  return {
    kind,
    read: () => ({ ...(store.getState()[field] as Record<string, unknown>) }),
    write: (items) => store.setState({ [field]: items } as Partial<S>),
    subscribe: (listener) =>
      store.subscribe((state, previous) => {
        if (state[field] !== previous[field]) listener()
      }),
  }
}

/** Several store fields synced together as one item (settings, the profile). */
export function settingsAdapter<S>(
  kind: string,
  store: Store<S>,
  fields: readonly (keyof S & string)[],
): SyncAdapter {
  const pick = (state: S) => Object.fromEntries(fields.map((f) => [f, state[f]]))
  return {
    kind,
    read: () => ({ me: pick(store.getState()) }),
    write: (items) => {
      const me = items.me
      if (!isObject(me)) return // settings are never deleted, only changed
      store.setState(
        Object.fromEntries(fields.filter((f) => f in me).map((f) => [f, me[f]])) as Partial<S>,
      )
    },
    subscribe: (listener) =>
      store.subscribe((state, previous) => {
        if (fields.some((f) => state[f] !== previous[f])) listener()
      }),
  }
}

/** A store field holding a list of strings, e.g. saved guide slugs. */
export function setAdapter<S>(kind: string, store: Store<S>, field: keyof S & string): SyncAdapter {
  const list = () => store.getState()[field] as string[]
  return {
    kind,
    read: () => Object.fromEntries(list().map((value) => [value, true])),
    write: (items) => {
      const kept = list().filter((v) => v in items)
      const added = Object.keys(items).filter((v) => !kept.includes(v))
      store.setState({ [field]: [...kept, ...added] } as Partial<S>)
    },
    subscribe: (listener) =>
      store.subscribe((state, previous) => {
        if (state[field] !== previous[field]) listener()
      }),
  }
}
