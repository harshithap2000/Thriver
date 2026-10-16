import { ExternalLinkIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { allGamesUrl, games } from '../games'

export function GamesHub() {
  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-ink text-2xl font-extrabold">Games</h1>
        <p className="text-ink-muted">
          Give your mind a playful break with a daily puzzle from New York Times Games.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3">
        {games.map((game) => (
          <li key={game.name}>
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${game.name}: ${game.description} (opens New York Times Games in a new tab)`}
              className="flex h-full flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className="flex items-start justify-between">
                <span
                  className={cn(
                    'text-ink grid size-11 place-items-center rounded-2xl text-lg font-extrabold',
                    game.tile,
                  )}
                  aria-hidden="true"
                >
                  {game.name.replace(/^The /, '')[0]}
                </span>
                {game.free && (
                  <span className="bg-mint text-pine rounded-full px-2 py-0.5 text-xs font-bold">
                    Free
                  </span>
                )}
              </span>
              <span>
                <span className="text-ink flex items-center gap-1 leading-snug font-bold">
                  {game.name}
                  <ExternalLinkIcon className="text-ink-muted size-3.5" />
                </span>
                <span className="text-ink-muted block text-sm">{game.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="space-y-2 text-center">
        <a
          href={allGamesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pine hover:bg-ink inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm"
        >
          Browse all New York Times Games
          <ExternalLinkIcon className="size-4" />
        </a>
        <p className="text-ink-muted text-xs">
          Games open on nytimes.com. Some need a New York Times Games subscription.
        </p>
      </div>
    </div>
  )
}
