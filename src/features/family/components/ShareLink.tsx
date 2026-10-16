import { useState } from 'react'

import { inputClass } from '@/shared/ui/Field'
import { cn } from '@/shared/utils/cn'

interface ShareLinkProps {
  url: string
  /** Text sent along with the link. */
  text: string
  title: string
}

/**
 * Share a link via the native share sheet when available, with copy, WhatsApp and SMS fallbacks.
 * (Share and clipboard APIs only exist on https, so the manual options always stay visible.)
 */
export function ShareLink({ url, text, title }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)
  const message = `${text} ${url}`
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const canCopy = typeof navigator !== 'undefined' && Boolean(navigator.clipboard)

  const optionClass =
    'flex-1 rounded-xl bg-white px-3 py-2.5 text-center text-sm font-bold text-ink shadow-sm hover:bg-mint'

  return (
    <div className="space-y-3">
      {canShare && (
        <button
          type="button"
          onClick={() => void navigator.share({ title, text, url }).catch(() => {})}
          className="bg-pine hover:bg-ink w-full rounded-xl px-4 py-3 font-bold text-white shadow-sm"
        >
          Share…
        </button>
      )}
      <div className="flex gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={optionClass}
        >
          WhatsApp
        </a>
        <a href={`sms:?&body=${encodeURIComponent(message)}`} className={optionClass}>
          Text message
        </a>
        {canCopy && (
          <button
            type="button"
            onClick={() =>
              void navigator.clipboard.writeText(url).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              })
            }
            className={optionClass}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        )}
      </div>
      <input
        readOnly
        value={url}
        aria-label="Link"
        onFocus={(e) => e.currentTarget.select()}
        className={cn(inputClass, 'text-ink-muted text-xs')}
      />
    </div>
  )
}
