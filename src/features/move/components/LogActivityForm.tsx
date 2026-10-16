import { useState, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

import { activityKinds, type ActivityKind } from '../activities'
import { useMoveStore } from '../useMoveStore'

const presets = [10, 20, 30, 45]

export function LogActivityForm() {
  const logActivity = useMoveStore((s) => s.logActivity)
  const [kind, setKind] = useState<ActivityKind>('walk')
  const [minutes, setMinutes] = useState(20)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    logActivity({ kind, minutes })
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Log activity"
      className="space-y-4 rounded-3xl bg-white p-5 shadow-sm"
    >
      <fieldset>
        <legend className="text-ink mb-2 text-sm font-semibold">What did you do?</legend>
        <div className="flex flex-wrap gap-2">
          {activityKinds.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              onClick={() => setKind(k.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                kind === k.id ? 'bg-pine text-white' : 'bg-cream text-ink hover:bg-mint',
              )}
            >
              <span aria-hidden="true">{k.emoji}</span> {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-ink mb-2 text-sm font-semibold">For how long?</legend>
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={minutes === p}
              onClick={() => setMinutes(p)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                minutes === p ? 'bg-move-ink text-white' : 'bg-move/50 text-ink hover:bg-move',
              )}
            >
              {p} min
            </button>
          ))}
          <label className="text-ink-muted flex items-center gap-1.5 text-sm">
            <input
              type="number"
              min={1}
              max={600}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              aria-label="Minutes"
              className="border-ink-muted/25 text-ink w-20 rounded-lg border px-2 py-1.5"
              required
            />
            min
          </label>
        </div>
      </fieldset>

      <Button type="submit" className="bg-pine hover:bg-ink w-full">
        Log activity
      </Button>
    </form>
  )
}
