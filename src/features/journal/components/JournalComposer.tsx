import { useState, type FormEvent } from 'react'

import { moods, useTodaysMood } from '@/features/mood-check-in'
import { Button } from '@/shared/ui/Button'
import { inputClass } from '@/shared/ui/Field'
import { cn } from '@/shared/utils/cn'

import { promptFor } from '../prompts'
import { useJournalStore } from '../useJournalStore'

export function JournalComposer() {
  const addEntry = useJournalStore((s) => s.addEntry)
  const todaysMoodId = useTodaysMood()
  const todaysMood = moods.find((m) => m.id === todaysMoodId)
  const [skip, setSkip] = useState(0)
  const [usePrompt, setUsePrompt] = useState(true)
  const [body, setBody] = useState('')
  const prompt = promptFor(new Date(), skip)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    addEntry({
      body: body.trim(),
      prompt: usePrompt ? prompt : undefined,
      mood: todaysMood?.id,
    })
    setBody('')
    setSkip((s) => s + 1)
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="New journal entry"
      className="space-y-3 rounded-3xl bg-linear-to-br from-[#fbe9ee] to-[#f1e8f8] p-5"
    >
      {usePrompt ? (
        <div>
          <p className="text-ink-muted text-xs font-semibold tracking-wide uppercase">
            Today&rsquo;s prompt
          </p>
          <p className="text-ink mt-1 text-lg leading-snug font-bold" id="journal-prompt">
            {prompt}
          </p>
          <div className="mt-2 flex gap-4 text-sm font-semibold">
            <button type="button" onClick={() => setSkip((s) => s + 1)} className="text-pine">
              Another prompt
            </button>
            <button type="button" onClick={() => setUsePrompt(false)} className="text-ink-muted">
              Write freely
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline justify-between">
          <p className="text-ink text-lg font-bold" id="journal-prompt">
            What&rsquo;s on your mind?
          </p>
          <button
            type="button"
            onClick={() => setUsePrompt(true)}
            className="text-pine text-sm font-semibold"
          >
            Use a prompt
          </button>
        </div>
      )}

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-labelledby="journal-prompt"
        placeholder="Start writing…"
        rows={5}
        maxLength={5000}
        required
        className={cn(inputClass, 'resize-y border-transparent bg-white/80')}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-ink-muted text-xs">
          {todaysMood ? `Tagged with today's mood: ${todaysMood.label}` : ''}
        </p>
        <Button type="submit" disabled={!body.trim()} className="bg-pine hover:bg-ink">
          Save entry
        </Button>
      </div>
    </form>
  )
}
