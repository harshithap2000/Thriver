import type Anthropic from '@anthropic-ai/sdk'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { Button } from '@/shared/ui/Button'
import { ChevronLeftIcon, SendIcon, SparklesIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/utils/cn'

import { loadFile } from '../fileStore'
import { useRecordsStore } from '../useRecordsStore'
import { askAssistant, AssistantError, type AssistantContext } from './assistantClient'
import { useAssistantConsent } from './useAssistantConsent'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  opened?: string[]
  isError?: boolean
}

/** Chat wording in each language. Hindi pending review by a native speaker. */
const text = {
  en: {
    title: 'Records assistant',
    newChat: 'New chat',
    none: 'Add some records first, then ask me anything about them.',
    intro: (n: number) =>
      `I can search and explain your ${n} saved record${n === 1 ? '' : 's'}. Try:`,
    suggestions: [
      'What were my most recent blood test results?',
      'Summarise my latest discharge letter in simple words',
      'When was my last vaccination?',
      'Which of my results were outside the normal range?',
    ],
    busy: 'Looking through your records…',
    placeholder: 'Ask about your records…',
    send: 'Send',
    refused:
      'Sorry, I can’t help with that one. Try asking another way, or check with your clinician.',
    noAnswer: 'I couldn’t find an answer to that.',
    usingProfile: 'Using your profile:',
    footer: 'AI can make mistakes. Not medical advice.',
  },
  hi: {
    title: 'रिकॉर्ड सहायक',
    newChat: 'नई बातचीत',
    none: 'पहले कुछ रिकॉर्ड जोड़ें, फिर उनके बारे में कुछ भी पूछें।',
    intro: (n: number) => `मैं आपके ${n} सहेजे गए रिकॉर्ड खोजकर समझा सकता हूँ। जैसे:`,
    suggestions: [
      'मेरी पिछली ब्लड रिपोर्ट में क्या आया?',
      'मेरी डिस्चार्ज रिपोर्ट को आसान शब्दों में समझाइए',
      'मेरा आखिरी टीका कब लगा था?',
      'मेरी कौन-सी जाँच सामान्य सीमा से बाहर थी?',
    ],
    busy: 'आपके रिकॉर्ड देखे जा रहे हैं…',
    placeholder: 'अपने रिकॉर्ड के बारे में पूछें…',
    send: 'भेजें',
    refused:
      'माफ़ कीजिए, इसमें मैं मदद नहीं कर सकता। कृपया दूसरे तरीके से पूछें या अपने डॉक्टर से बात करें।',
    noAnswer: 'मुझे इसका जवाब नहीं मिला।',
    usingProfile: 'आपकी प्रोफ़ाइल के अनुसार:',
    footer: 'AI से गलती हो सकती है। यह चिकित्सीय सलाह नहीं है।',
  },
}

function errorMessage(error: unknown) {
  if (error instanceof AssistantError) {
    if (error.status === 503) {
      return 'The assistant isn’t set up yet. Add an Anthropic API key to the server (see the README).'
    }
    return error.message
  }
  return 'Couldn’t reach the assistant. Check your connection and try again.'
}

interface Props {
  /** Name-free profile to give answers context, and how to describe it to the user. */
  profile?: { context: NonNullable<AssistantContext['profile']>; label: string }
}

export function AssistantChat({ profile }: Props) {
  const records = useRecordsStore((s) => s.records)
  const { consented, setConsented, language, setLanguage } = useAssistantConsent()
  const t = text[language]
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
        context: { language, profile: profile?.context },
        question: q,
        records,
        loadFile,
      })
      history.current = result.history
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: result.refused ? t.refused : result.reply || t.noAnswer,
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
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/records"
          className="text-ink-muted hover:text-ink inline-flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeftIcon className="size-4" /> Records
        </Link>
        <div role="group" aria-label="Language" className="flex rounded-2xl bg-white p-1 shadow-sm">
          {(
            [
              ['en', 'EN', 'English'],
              ['hi', 'हिंदी', 'Hindi'],
            ] as const
          ).map(([id, label, name]) => (
            <button
              key={id}
              type="button"
              lang={id}
              aria-label={name}
              aria-pressed={language === id}
              onClick={() => setLanguage(id)}
              className={cn(
                'rounded-xl px-4 py-1.5 text-sm font-bold',
                language === id ? 'bg-mint text-pine' : 'text-ink-muted',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <h1 lang={language} className="text-ink flex items-center gap-2 text-2xl font-extrabold">
          <SparklesIcon className="text-sleep-ink size-6" /> {t.title}
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
            {t.newChat}
          </button>
        )}
      </div>
      {consented && profile && (
        <p className="bg-mint text-pine inline-block rounded-full px-3 py-1 text-xs font-bold">
          {t.usingProfile} {profile.label}
        </p>
      )}
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
              records, any record it opens to answer you, and your health profile (cancer type,
              treatments, days since surgery, never your name) are sent to Anthropic to generate a
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
    <div lang={language} className="flex min-h-[calc(100dvh-10rem)] flex-col gap-5">
      {header}

      <div className="flex-1 space-y-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-ink-muted">
              {records.length === 0 ? t.none : t.intro(records.length)}
            </p>
            {records.length > 0 &&
              t.suggestions.map((s) => (
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
            {t.busy}
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
          placeholder={t.placeholder}
          aria-label={t.placeholder.replace('…', '')}
          className="border-ink-muted/20 text-ink focus:border-pine focus:ring-pine/20 max-h-32 min-h-12 flex-1 resize-none rounded-3xl border bg-white px-4 py-3 shadow-sm outline-none focus:ring-2"
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          aria-label={t.send}
          className="bg-pine hover:bg-ink grid size-12 shrink-0 place-items-center rounded-full text-white shadow-sm disabled:opacity-40"
        >
          <SendIcon className="size-5" />
        </button>
      </form>
      <p className="text-ink-muted -mt-3 text-center text-xs">{t.footer}</p>
    </div>
  )
}
