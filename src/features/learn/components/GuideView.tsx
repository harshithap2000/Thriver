import { Link } from 'react-router'

import { BookmarkIcon, ChevronLeftIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { findGuide, topicInfo, type Block } from '../guides'
import { useSavedGuides } from '../useSavedGuides'

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h':
      return <h2 className="text-ink pt-2 text-lg font-bold">{block.text}</h2>
    case 'p':
      return <p className="text-ink leading-relaxed">{block.text}</p>
    case 'list':
      return (
        <ul className="text-ink list-disc space-y-1.5 pl-5 leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <p
          role={block.tone === 'warning' ? 'note' : undefined}
          className={cn(
            'text-ink rounded-2xl p-4 text-sm leading-relaxed',
            block.tone === 'warning' ? 'bg-move/60' : 'bg-mint',
          )}
        >
          {block.tone === 'warning' ? '⚠️ ' : 'ℹ️ '}
          {block.text}
        </p>
      )
  }
}

export function GuideView({ slug }: { slug: string }) {
  const guide = findGuide(slug)
  const isSaved = useSavedGuides((s) => s.saved.includes(slug))
  const toggleSaved = useSavedGuides((s) => s.toggleSaved)

  if (!guide) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-ink font-bold">Guide not found</p>
        <Link to="/learn" className="text-pine font-semibold underline">
          Back to Learn
        </Link>
      </div>
    )
  }

  const topic = topicInfo(guide.topic)

  return (
    <article className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          to="/learn"
          className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeftIcon className="size-4" /> Learn
        </Link>
        <button
          type="button"
          onClick={() => toggleSaved(guide.slug)}
          aria-pressed={isSaved}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold',
            isSaved ? 'bg-pine text-white' : 'text-ink bg-white shadow-sm',
          )}
        >
          <BookmarkIcon className="size-4" /> {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      <header className="space-y-2">
        <p className="text-ink-muted text-sm font-semibold">
          {topic.emoji} {topic.label} · {guide.minutes} min read
        </p>
        <h1 className="text-ink text-2xl leading-tight font-extrabold">{guide.title}</h1>
        <p className="text-ink-muted">{guide.summary}</p>
        {guide.reviewed ? (
          <span className="bg-mint text-pine inline-block rounded-full px-2.5 py-0.5 text-xs font-bold">
            ✓ Reviewed by {guide.reviewed.by} · {guide.reviewed.date}
          </span>
        ) : (
          <span className="inline-block rounded-full bg-[#fff3cf] px-2.5 py-0.5 text-xs font-bold text-[#8a6a00]">
            Pending clinical review
          </span>
        )}
      </header>

      <div className="space-y-4">
        {guide.body.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      {guide.questions && (
        <section
          aria-labelledby="questions-title"
          className="space-y-2 rounded-3xl bg-white p-5 shadow-sm"
        >
          <h2 id="questions-title" className="text-ink font-bold">
            Questions to ask your doctor
          </h2>
          <ul className="text-ink space-y-2 text-sm">
            {guide.questions.map((q) => (
              <li key={q} className="flex gap-2">
                <span aria-hidden="true">💬</span>
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="sources-title" className="space-y-2">
        <h2 id="sources-title" className="text-ink-muted text-sm font-bold">
          Sources
        </h2>
        <ul className="space-y-1 text-sm">
          {guide.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pine underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-ink-muted text-xs">
        This guide gives general information. Your own care team knows your situation best.
      </p>
    </article>
  )
}
