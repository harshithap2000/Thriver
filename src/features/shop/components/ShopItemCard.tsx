import { Link } from 'react-router'

import { cn } from '@/shared/utils/cn'

import type { ShopItem } from '../catalogue'
import { StoreButtons } from './StoreButtons'

export function ShopItemCard({ item }: { item: ShopItem }) {
  return (
    <article className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <span
          className={cn('grid size-12 shrink-0 place-items-center rounded-2xl text-2xl', item.tile)}
          aria-hidden="true"
        >
          {item.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-ink font-bold">{item.name}</h3>
            {item.askFirst && (
              <span className="rounded-full bg-[#fff3cf] px-2 py-0.5 text-[11px] font-bold text-[#8a6a00]">
                Ask your care team first
              </span>
            )}
          </div>
          <p className="text-ink-muted text-sm">{item.why}</p>
        </div>
      </div>
      <ul className="text-ink space-y-1 text-sm">
        {item.tips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span aria-hidden="true">✓</span>
            {tip}
          </li>
        ))}
      </ul>
      {item.guide && (
        <Link
          to={`/learn/${item.guide}`}
          className="text-pine inline-block text-sm font-semibold underline"
        >
          Read the guide
        </Link>
      )}
      <StoreButtons ids={item.stores} query={item.searchTerm} label={item.name} />
    </article>
  )
}
