import { Link } from 'react-router'

import { guides } from '@/features/learn'
import { essentials, foods, StoreButtons } from '@/features/shop'
import { SparklesIcon } from '@/shared/ui/icons'

import type { PickKind } from '../candidates'
import { useAiPicks } from '../useAiPicks'

const shopItems = [...essentials, ...foods]

export function PickedForYou({ kind }: { kind: PickKind }) {
  const { source, picks, hasProfile } = useAiPicks()

  if (!hasProfile) {
    return (
      <Link
        to="/profile/health"
        className="flex items-center gap-3 rounded-3xl bg-linear-to-r from-[#e1efe1] to-[#ddd5f6] p-4"
      >
        <SparklesIcon className="text-sleep-ink size-6 shrink-0" />
        <span className="text-ink text-sm">
          <b>Get picks for your recovery.</b> Tell us about your cancer in your health profile.
        </span>
      </Link>
    )
  }

  const list = picks[kind]

  return (
    <section
      aria-labelledby={`picks-${kind}`}
      className="space-y-3 rounded-3xl bg-linear-to-br from-[#e1efe1] to-[#ece6fa] p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id={`picks-${kind}`} className="text-ink flex items-center gap-2 font-bold">
          <SparklesIcon className="text-sleep-ink size-5" /> Picked for you
        </h2>
        <span className="text-ink-muted text-xs font-semibold">
          {source === 'ai' ? 'By Thriver AI' : source === 'loading' ? '' : 'Based on your profile'}
        </span>
      </div>

      {source === 'loading' ? (
        <p role="status" className="text-ink-muted text-sm">
          Finding the most useful picks for you…
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((pick) => {
            if (kind === 'learn') {
              const guide = guides.find((g) => g.slug === pick.id)
              if (!guide) return null
              return (
                <li key={pick.id}>
                  <Link
                    to={`/learn/${guide.slug}`}
                    className="block rounded-2xl bg-white/85 p-3 hover:bg-white"
                  >
                    <span className="text-ink block font-bold">{guide.title}</span>
                    <span className="text-ink-muted block text-sm">{pick.reason}</span>
                  </Link>
                </li>
              )
            }
            const item = shopItems.find((i) => i.id === pick.id)
            if (!item) return null
            return (
              <li key={pick.id} className="space-y-2 rounded-2xl bg-white/85 p-3">
                <p>
                  <span className="text-ink block font-bold">
                    {item.emoji} {item.name}
                  </span>
                  <span className="text-ink-muted block text-sm">{pick.reason}</span>
                </p>
                <StoreButtons
                  ids={item.stores.slice(0, 1)}
                  query={item.searchTerm}
                  label={item.name}
                />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
