import { ExternalLinkIcon } from '@/shared/ui/icons'

import { stores, type StoreId } from '../partners'

export function StoreButtons({
  ids,
  query,
  label,
}: {
  ids: StoreId[]
  query: string
  label: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ids.map((id) => {
        const store = stores[id]
        return (
          <a
            key={id}
            href={store.search(query)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Find ${label} on ${store.name} (opens in a new tab)`}
            className="bg-cream text-ink hover:bg-mint inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold"
          >
            {store.name}
            <ExternalLinkIcon className="text-ink-muted size-3" />
          </a>
        )
      })}
    </div>
  )
}
