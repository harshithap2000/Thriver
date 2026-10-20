import { create } from 'zustand'

import { listAdapter, recordAdapter, settingsAdapter } from './adapters'
import { emptyMeta, OtherAccountError, syncOnce } from './engine'
import { stableJson } from './stableJson'
import type { SyncMeta, SyncRemote, SyncRow } from './types'

interface Appointment {
  id: string
  title: string
}
interface DeviceState {
  profile: { name: string; onboarded: boolean }
  appointments: Appointment[]
  checkIns: Record<string, { pain: number }>
}

/** A device: its own stores (the local cache) and sync bookkeeping. */
function device(initial: Partial<DeviceState> = {}) {
  const store = create<DeviceState>()(() => ({
    profile: { name: '', onboarded: false },
    appointments: [],
    checkIns: {},
    ...initial,
  }))
  const adapters = [
    settingsAdapter('profile', store, ['profile']),
    listAdapter('appointment', store, 'appointments', (a: Appointment) => a.id),
    recordAdapter('check_in', store, 'checkIns'),
  ]
  let meta: SyncMeta = emptyMeta()
  let clock = Date.parse('2026-10-20T09:00:00Z')
  return {
    store,
    get meta() {
      return meta
    },
    /** Moves this device's clock on, so its next edit is later. */
    tick: (ms = 60_000) => (clock += ms),
    sync: async (remote: SyncRemote, userId = 'asha') => {
      meta = await syncOnce({ userId, adapters, remote, meta, now: () => new Date(clock) })
    },
  }
}

/** In-memory server with the same rules as the database: own rows, last write wins. */
function fakeServer() {
  const rows = new Map<string, SyncRow & { user: string; updated_at: string }>()
  let serverClock = Date.parse('2026-10-20T00:00:00Z')
  const pushes: SyncRow[][] = []
  const remote: SyncRemote = {
    push: async (userId, batch) => {
      pushes.push(batch)
      return batch.map((row) => {
        const id = `${userId}|${row.kind}|${row.key}`
        const existing = rows.get(id)
        if (existing && row.client_updated_at < existing.client_updated_at) return existing
        const stored = {
          ...row,
          data: row.deleted ? null : structuredClone(row.data),
          user: userId,
          updated_at: new Date((serverClock += 1000)).toISOString(),
        }
        rows.set(id, stored)
        return stored
      })
    },
    pull: async (userId, since) =>
      [...rows.values()]
        .filter((r) => r.user === userId && (!since || r.updated_at >= since))
        .sort((a, b) => a.updated_at.localeCompare(b.updated_at)),
  }
  return { remote, rows, pushes }
}

describe('sync engine', () => {
  it('backs up a device and then sends only what changed', async () => {
    const server = fakeServer()
    const phone = device({
      profile: { name: 'Asha', onboarded: true },
      appointments: [{ id: 'a1', title: 'Physio' }],
    })
    await phone.sync(server.remote)
    expect([...server.rows.keys()].sort()).toEqual(['asha|appointment|a1', 'asha|profile|me'])

    server.pushes.length = 0
    await phone.sync(server.remote)
    expect(server.pushes).toEqual([]) // nothing changed

    phone.store.setState({ checkIns: { '2026-10-20': { pain: 3 } } })
    await phone.sync(server.remote)
    expect(server.pushes.flat().map((r) => r.key)).toEqual(['2026-10-20'])
  })

  it('restores the backup on a new phone and keeps what was only on that phone', async () => {
    const server = fakeServer()
    const oldPhone = device({
      profile: { name: 'Asha', onboarded: true },
      appointments: [{ id: 'a1', title: 'Physio' }],
    })
    await oldPhone.sync(server.remote)

    // A fresh phone: not onboarded yet, but one appointment added before signing in.
    const newPhone = device({ appointments: [{ id: 'a2', title: 'Scan' }] })
    newPhone.tick(10 * 60_000) // even though its edits are "newer", the backup wins
    await newPhone.sync(server.remote)

    expect(newPhone.store.getState().profile).toEqual({ name: 'Asha', onboarded: true })
    expect(
      newPhone.store
        .getState()
        .appointments.map((a) => a.id)
        .sort(),
    ).toEqual(['a1', 'a2'])
    expect(server.rows.get('asha|profile|me')?.data).toEqual({
      profile: { name: 'Asha', onboarded: true },
    })

    await oldPhone.sync(server.remote)
    expect(oldPhone.store.getState().appointments.map((a) => a.id)).toEqual(['a1', 'a2'])
  })

  it('passes edits and deletions between devices', async () => {
    const server = fakeServer()
    const a = device({ appointments: [{ id: 'a1', title: 'Physio' }] })
    const b = device()
    await a.sync(server.remote)
    await b.sync(server.remote)

    a.tick()
    a.store.setState({
      appointments: [{ id: 'a1', title: 'Physio, room 4' }],
      checkIns: { '2026-10-20': { pain: 2 } },
    })
    await a.sync(server.remote)
    await b.sync(server.remote)
    expect(b.store.getState().appointments).toEqual([{ id: 'a1', title: 'Physio, room 4' }])
    expect(b.store.getState().checkIns).toEqual({ '2026-10-20': { pain: 2 } })

    b.tick(120_000)
    b.store.setState({ appointments: [] })
    await b.sync(server.remote)
    await a.sync(server.remote)
    expect(a.store.getState().appointments).toEqual([])
    expect(server.rows.get('asha|appointment|a1')).toMatchObject({ deleted: true, data: null })
  })

  it('keeps the later edit when two devices change the same item', async () => {
    const server = fakeServer()
    const a = device({ checkIns: { d: { pain: 1 } } })
    const b = device()
    await a.sync(server.remote)
    await b.sync(server.remote)

    a.tick(60_000)
    a.store.setState({ checkIns: { d: { pain: 4 } } }) // earlier edit
    b.tick(120_000)
    b.store.setState({ checkIns: { d: { pain: 7 } } }) // later edit

    await b.sync(server.remote)
    await a.sync(server.remote) // a's older edit loses to b's
    await b.sync(server.remote)

    expect(a.store.getState().checkIns.d).toEqual({ pain: 7 })
    expect(b.store.getState().checkIns.d).toEqual({ pain: 7 })
  })

  it('never mixes data from two accounts on one device', async () => {
    const server = fakeServer()
    const phone = device({ profile: { name: 'Asha', onboarded: true } })
    await phone.sync(server.remote, 'asha')
    await expect(phone.sync(server.remote, 'ravi')).rejects.toBeInstanceOf(OtherAccountError)
    expect([...server.rows.keys()].some((k) => k.startsWith('ravi|'))).toBe(false)
  })

  it('compares values regardless of key order (Postgres reorders JSON keys)', () => {
    expect(stableJson({ b: 1, a: { d: 2, c: undefined } })).toBe(stableJson({ a: { d: 2 }, b: 1 }))
  })
})
