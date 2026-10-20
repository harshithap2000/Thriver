import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { supabaseRemote } from './remote'

/**
 * Runs against a local Supabase stack (pnpm db:start), using the test phone numbers from
 * supabase/config.toml. Skipped unless SUPABASE_TEST_URL and SUPABASE_TEST_KEY are set:
 *   SUPABASE_TEST_URL=http://127.0.0.1:54321 SUPABASE_TEST_KEY=<publishable key> pnpm test
 */
const url = process.env.SUPABASE_TEST_URL
const key = process.env.SUPABASE_TEST_KEY

async function signIn(phone: string) {
  const client = createClient(url!, key!, { auth: { persistSession: false } })
  const sent = await client.auth.signInWithOtp({ phone })
  if (sent.error) throw sent.error
  const { data, error } = await client.auth.verifyOtp({ phone, token: '123456', type: 'sms' })
  if (error) throw error
  return { client, userId: data.user!.id }
}

describe.skipIf(!url || !key)('Supabase sync (local stack)', () => {
  let asha: { client: SupabaseClient; userId: string }
  let ravi: { client: SupabaseClient; userId: string }
  const kind = `test_${Date.now().toString(36)}`

  beforeAll(async () => {
    asha = await signIn('+919999900001')
    ravi = await signIn('+919999900002')
  })

  it('stores and returns a person’s own items, and keeps the later edit', async () => {
    const remote = supabaseRemote(asha.client)
    const [kept] = await remote.push(asha.userId, [
      {
        kind,
        key: 'd1',
        data: { pain: 3, note: 'ok' },
        deleted: false,
        client_updated_at: '2026-10-01T10:00:00Z',
      },
    ])
    expect(kept).toMatchObject({ kind, key: 'd1', data: { pain: 3, note: 'ok' } })

    const [stale] = await remote.push(asha.userId, [
      {
        kind,
        key: 'd1',
        data: { pain: 9 },
        deleted: false,
        client_updated_at: '2026-10-01T09:00:00Z',
      },
    ])
    expect(stale!.data).toEqual({ pain: 3, note: 'ok' })

    const rows = await remote.pull(asha.userId, null)
    expect(rows.filter((r) => r.kind === kind)).toHaveLength(1)
  })

  it('hides one person’s items from another and blocks writing to their account', async () => {
    const remote = supabaseRemote(ravi.client)
    const rows = await remote.pull(asha.userId, null)
    expect(rows).toEqual([])
    await expect(
      remote.push(asha.userId, [
        { kind, key: 'x', data: {}, deleted: false, client_updated_at: '2026-10-01T10:00:00Z' },
      ]),
    ).rejects.toThrow(/row-level security/)
  })

  it('records deletions as tombstones', async () => {
    const remote = supabaseRemote(asha.client)
    const [gone] = await remote.push(asha.userId, [
      { kind, key: 'd1', data: null, deleted: true, client_updated_at: '2026-10-01T11:00:00Z' },
    ])
    expect(gone).toMatchObject({ deleted: true, data: null })
  })
})
