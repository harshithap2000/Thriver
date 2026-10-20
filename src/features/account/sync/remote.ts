import type { SupabaseClient } from '@supabase/supabase-js'

import type { SyncRemote, SyncRow } from './types'

const COLUMNS = 'kind,key,data,deleted,client_updated_at,updated_at'
const PAGE = 1000

/** Sync against the `sync_items` table. Row-level security limits every call to the user's rows. */
export function supabaseRemote(client: SupabaseClient): SyncRemote {
  return {
    push: async (userId, rows) => {
      const { data, error } = await client
        .from('sync_items')
        .upsert(
          rows.map((row) => ({ ...row, user_id: userId })),
          { onConflict: 'user_id,kind,key' },
        )
        .select(COLUMNS)
      if (error) throw new Error(error.message)
      return data as SyncRow[]
    },
    pull: async (userId, since) => {
      const rows: SyncRow[] = []
      for (let from = 0; ; from += PAGE) {
        let query = client.from('sync_items').select(COLUMNS).eq('user_id', userId)
        if (since) query = query.gte('updated_at', since)
        const { data, error } = await query
          .order('updated_at')
          .order('kind')
          .order('key')
          .range(from, from + PAGE - 1)
        if (error) throw new Error(error.message)
        rows.push(...(data as SyncRow[]))
        if (data.length < PAGE) return rows
      }
    },
  }
}
