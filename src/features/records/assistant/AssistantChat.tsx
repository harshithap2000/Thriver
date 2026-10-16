import type Anthropic from '@anthropic-ai/sdk'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { Button } from '@/shared/ui/Button'
import { ChevronLeftIcon, SendIcon, SparklesIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { loadFile } from '../fileStore'
import { useRecordsStore } from '../useRecordsStore'
import { askAssistant, AssistantError } from './assistantClient'
import { useAssistantConsent } from './useAssistantConsent'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  opened?: string[]
  isError?: boolean
}

const suggestions = [
  'What were my most recent blood test results?',
  'Summarise my latest discharge letter in simple words',
  'When was my last vaccination?',
  'Which of my results were outside the normal range?',
]

function errorMessage(error: unknown) {
  if (error instanceof AssistantError) {
    if (error.status === 503) {
      return 'The assistant isn’t set up yet. Add an Anthropic API key to the server (see the README).'
    }
    return error.message
  }
  return 'Couldn’t reach the assistant. Check your connection and try again.'
}

export function AssistantChat() {
  const records = useRecordsStore((s) => s.records)
  const { consented, setConsented } = useAssistantConsent()
  const [params] = useSearchParams()
  const about = records.find((r) => r.id === params.get('about'))

  const history = useRef<Anthropic.Beta.BetaMessageParam[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState(() =>
    about ? `Explain my "${about.title}" from ${about.date} in simple terms.` : '',
  )
  const [busy, setBusy] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottom.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' })
  }, [messages, busy])

  const ask = async (question: string) => {
    const q = question.trim()
    if (!q || busy) return
    setDraft('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setBusy(true)
    try {
      const result = await askAssistant({
        history: history.current,
        question: q,
        records,
        loadFile,
      })
      history.current = result.history
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: result.refused
            ? 'Sorry, I can’t help with that one. Try asking another way, or check with your clinician.'
            : result.reply || 'I couldn’t find an answer to that.',
          opened: result.opened,
        },
      ])
    } catch (error) {
      setMessages((m) => [...m, { role: 'assistant', text: errorMessage(error), isError: true }])
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void ask(draft)
  }

  const header = (
    <header className="space-y-3">
      <Link
        to="/records"
        className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
      >
        <ChevronLeftIcon className="size-4" /> Records
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-ink flex items-center gap-2 text-2xl font-extrabold">
          <SparklesIcon className="text-sleep-ink size-6" /> Records assistant
        </h1>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              history.current = []
              setMessages([])
            }}
            className="text-ink-muted hover:text-ink text-sm font-semibold"
          >
            New chat
          </button>
        )}
      </div>
    </header>
  )

  if (!consented) {
    return (
      <div className="space-y-6">
        {header}
        <section
          aria-labelledby="consent-title"
          className="space-y-3 rounded-3xl bg-white p-5 shadow-sm"
        >
          <h2 id="consent-title" className="text-ink font-bold">
            Before you start
          </h2>
          <ul className="text-ink list-disc space-y-2 pl-5 text-sm">
            <li>
              The assistant uses Claude, an AI made by Anthropic. Your questions, the list of your
              records, and any record it opens to answer you are sent to Anthropic to generate a
              reply.
            </li>
            <li>It can make mistakes. Check important details against the original document.</li>
            <li>
              It explains your records but isn&rsquo;t a doctor. Talk to your clinician about
              decisions, and call emergency services in an emergency.
            </li>
          </ul>
          <Button onClick={() => setConsented(true)} className="bg-pine hover:bg-ink w-full py-3">
            I understand, continue
          </Button>
        </section>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] flex-col gap-5">
      {header}

      <div className="flex-1 space-y-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-ink-muted">
              {records.length === 0
                ? 'Add some records first, then ask me anything about them.'
                : `I can search and explain your ${records.length} saved record${records.length === 1 ? '' : 's'}. Try:`}
            </p>
            {records.length > 0 &&
              suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void ask(s)}
                  className="text-ink hover:bg-mint block w-full rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold shadow-sm"
                >
                  {s}
                </button>
              ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[85%] rounded-3xl px-4 py-3 whitespace-pre-wrap',
                m.role === 'user'
                  ? 'bg-pine rounded-br-lg text-white'
                  : m.isError
                    ? 'bg-move/50 text-ink rounded-bl-lg'
                    : 'text-ink rounded-bl-lg bg-white shadow-sm',
              )}
            >
              {m.text}
              {m.opened && m.opened.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-1.5 text-xs" aria-label="Records read">
                  {[...new Set(m.opened)].map((title) => (
                    <span
                      key={title}
                      className="bg-mint text-pine rounded-full px-2 py-0.5 font-semibold"
                    >
                      📄 {title}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div role="status" className="text-ink-muted flex items-center gap-2 text-sm">
            <span className="bg-sleep-ink size-2 animate-bounce rounded-full" />
            <span className="bg-sleep-ink size-2 animate-bounce rounded-full [animation-delay:150ms]" />
            <span className="bg-sleep-ink size-2 animate-bounce rounded-full [animation-delay:300ms]" />
            Looking through your records…
          </div>
        )}
        <div ref={bottom} />
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-24 flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void ask(draft)
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder="Ask about your records…"
          aria-label="Ask about your records"
          className="border-ink-muted/20 text-ink focus:border-pine focus:ring-pine/20 max-h-32 min-h-12 flex-1 resize-none rounded-3xl border bg-white px-4 py-3 shadow-sm outline-none focus:ring-2"
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          aria-label="Send"
          className="bg-pine hover:bg-ink grid size-12 shrink-0 place-items-center rounded-full text-white shadow-sm disabled:opacity-40"
        >
          <SendIcon className="size-5" />
        </button>
      </form>
      <p className="text-ink-muted -mt-3 text-center text-xs">
        AI can make mistakes. Not medical advice.
      </p>
    </div>
  )
}
