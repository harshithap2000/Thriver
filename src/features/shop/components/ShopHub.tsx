import { useMemo, useState, type ReactNode } from 'react'

import { personalise, useProfileStore } from '@/features/profile'
import { cn } from '@/shared/utils/cn'

import { essentials, foods, services, type ShopItem } from '../catalogue'
import { MedicineRefills } from './MedicineRefills'
import { ShopItemCard } from './ShopItemCard'

const sections = [
  { id: 'essentials', label: 'Recovery essentials' },
  { id: 'refills', label: 'Medicine refills' },
  { id: 'food', label: 'Food' },
  { id: 'services', label: 'Services' },
] as const

type Section = (typeof sections)[number]['id']

/** Items for this person first; items for other cancers behind a toggle. */
function PersonalisedItems({ items }: { items: readonly ShopItem[] }) {
  const health = useProfileStore((s) => s.health)
  const [showAll, setShowAll] = useState(false)
  const { items: mine, hidden } = useMemo(() => personalise(items, health), [items, health])
  const list = showAll ? [...mine, ...hidden.map((i) => ({ ...i, forYou: false }))] : mine

  return (
    <>
      {list.map((item) => (
        <ShopItemCard key={item.id} item={item} forYou={item.forYou} />
      ))}
      {hidden.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-pine hover:bg-mint w-full rounded-2xl py-3 text-sm font-semibold"
        >
          {showAll ? 'Show only items for me' : `Show ${hidden.length} more for other needs`}
        </button>
      )}
    </>
  )
}

/** `picks` is an optional slot (e.g. AI picks) shown under the header. */
export function ShopHub({ picks }: { picks?: ReactNode }) {
  const [section, setSection] = useState<Section>('essentials')

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">Shop</h1>
        <p className="text-ink-muted">
          Hand-picked for recovery. You buy from trusted stores; Thriver doesn’t earn from these
          links.
        </p>
      </header>

      {picks}

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={section === s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold',
              section === s.id ? 'bg-pine text-white' : 'text-ink bg-white shadow-sm',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'essentials' && (
        <section aria-label="Recovery essentials" className="space-y-3">
          <PersonalisedItems items={essentials} />
        </section>
      )}

      {section === 'refills' && (
        <section aria-label="Medicine refills">
          <MedicineRefills />
        </section>
      )}

      {section === 'food' && (
        <section aria-label="Food" className="space-y-3">
          <PersonalisedItems items={foods} />
          <div className="rounded-3xl bg-linear-to-br from-[#fff3cf] to-[#fbe9ee] p-4">
            <p className="text-ink font-bold">🍱 Dietitian-approved meal kits</p>
            <p className="text-ink-muted text-sm">Coming soon with partner kitchens.</p>
          </div>
          <p className="text-ink-muted text-xs">
            If you have diabetes, kidney problems or difficulty swallowing, check with your
            dietitian first.
          </p>
        </section>
      )}

      {section === 'services' && (
        <section aria-label="Services" className="space-y-3">
          {services.map((s) => (
            <article key={s.id} className="flex gap-3 rounded-3xl bg-white p-4 shadow-sm">
              <span className="text-3xl" aria-hidden="true">
                {s.emoji}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="text-ink font-bold">{s.name}</h3>
                <p className="text-ink-muted text-sm">{s.description}</p>
                {s.action ? (
                  <a
                    href={s.action.href}
                    {...(s.action.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="bg-pine hover:bg-ink inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white"
                  >
                    {s.action.label}
                  </a>
                ) : (
                  <span className="bg-sleep text-sleep-ink inline-block rounded-full px-3 py-1 text-xs font-bold">
                    Booking through Thriver coming soon
                  </span>
                )}
              </div>
            </article>
          ))}
          <p className="text-ink-muted text-xs">In an emergency, call 112.</p>
        </section>
      )}

      <p className="text-ink-muted text-center text-xs">
        Recommendations are general, not medical advice. Product listings belong to each store.
      </p>
    </div>
  )
}
