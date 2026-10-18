import { useEffect, useMemo, useState } from 'react'

import { useProfileStore } from '@/features/profile'

import { aiProfile, buildCandidates, rulePicks, type Picks } from './candidates'
import { useAiPicksStore } from './useAiPicksStore'

export const AI_PICKS_ENDPOINT = '/api/ai-picks'

export type PicksSource = 'ai' | 'rules' | 'loading'

/**
 * Personalised picks. With AI consent, asks the AI once per profile/catalogue change and caches
 * the result; otherwise (or if the AI is unavailable) uses profile-based rules.
 */
export function useAiPicks(fetchImpl: typeof fetch = fetch) {
  const health = useProfileStore((s) => s.health)
  const aiOn = useProfileStore((s) => s.aiPersonalise)
  const cached = useAiPicksStore()
  const [failedKey, setFailedKey] = useState<string | null>(null)

  const candidates = useMemo(() => buildCandidates(health), [health])
  const fallback = useMemo(() => rulePicks(health, candidates), [health, candidates])
  const key = useMemo(
    () => JSON.stringify({ v: 1, p: aiProfile(health), c: candidates.map((c) => c.id) }),
    [health, candidates],
  )
  const hasProfile =
    health.cancerType !== null || health.conditions.length > 0 || health.treatments.length > 0

  const needsFetch = aiOn && hasProfile && cached.key !== key && failedKey !== key
  const { save } = cached

  useEffect(() => {
    if (!needsFetch) return
    let cancelled = false
    void fetchImpl(AI_PICKS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        health: aiProfile(health),
        candidates: candidates.map(({ id, kind, title, summary }) => ({
          id,
          kind,
          title,
          summary,
        })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status))
        const picks = (await res.json()) as Picks
        if (!cancelled) save(key, picks)
      })
      .catch(() => {
        if (!cancelled) setFailedKey(key)
      })
    return () => {
      cancelled = true
    }
  }, [needsFetch, fetchImpl, health, candidates, key, save])

  let source: PicksSource = 'rules'
  let picks: Picks = fallback
  if (aiOn && hasProfile) {
    if (cached.key === key && cached.picks) {
      source = 'ai'
      picks = cached.picks
    } else if (failedKey !== key) {
      source = 'loading'
    }
  }
  return { source, picks, candidates, hasProfile }
}
