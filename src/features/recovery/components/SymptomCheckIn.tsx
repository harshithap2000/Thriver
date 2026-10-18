import { useState } from 'react'
import { useNavigate } from 'react-router'

import { moods, MoodFace, useMoodStore, useTodaysMood, type MoodId } from '@/features/mood-check-in'
import { useProfileStore } from '@/features/profile'
import { CareDisclaimer } from '@/shared/ui/Notices'
import { cn } from '@/shared/utils/cn'

import { useRecoveryStore, useTodaysCheckIn } from '../useRecoveryStore'
import { warningSignsFor, type WarningSignId } from '../warningSigns'

const today = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

function Slider({
  label,
  value,
  onChange,
  colour,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  colour: string
}) {
  const id = `slider-${label.toLowerCase()}`
  return (
    <div className="space-y-2 rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <label htmlFor={id} className="text-ink text-lg font-bold">
          {label}
        </label>
        <span className="text-ink-muted">{value} / 10</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('w-full', colour)}
      />
      <div className="text-ink-muted flex justify-between text-xs" aria-hidden="true">
        <span>None</span>
        <span>Worst</span>
      </div>
    </div>
  )
}

/** Daily symptom check-in: tiredness, pain, warning signs and mood. */
export function SymptomCheckIn() {
  const navigate = useNavigate()
  const health = useProfileStore((s) => s.health)
  const saved = useTodaysCheckIn()
  const saveCheckIn = useRecoveryStore((s) => s.saveCheckIn)
  const savedMood = useTodaysMood()
  const setMood = useMoodStore((s) => s.checkIn)
  const signs = warningSignsFor(health)

  const [tiredness, setTiredness] = useState(saved?.tiredness ?? 3)
  const [pain, setPain] = useState(saved?.pain ?? 2)
  const [warnings, setWarnings] = useState<WarningSignId[]>(saved?.warnings ?? [])
  const [mood, setMoodChoice] = useState<MoodId | undefined>(savedMood)

  const answer = (id: WarningSignId, yes: boolean) =>
    setWarnings((w) => (yes ? [...new Set([...w, id])] : w.filter((x) => x !== id)))

  return (
    <form
      aria-label="Daily check-in"
      onSubmit={(e) => {
        e.preventDefault()
        saveCheckIn({ tiredness, pain, warnings })
        if (mood) setMood(mood)
        navigate(warnings.length ? '/check-in/alert' : '/', { replace: true })
      }}
      className="space-y-5"
    >
      <header>
        <p className="text-ink-muted text-sm">Daily check-in · {today.format(new Date())}</p>
        <h1 className="text-ink text-[1.75rem] font-extrabold">How are you today?</h1>
      </header>

      <Slider
        label="Tiredness"
        value={tiredness}
        onChange={setTiredness}
        colour="accent-sleep-ink"
      />
      <Slider label="Pain" value={pain} onChange={setPain} colour="accent-[#c94a33]" />

      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        {signs.map((sign) => {
          const yes = warnings.includes(sign.id)
          return (
            <fieldset key={sign.id} className="flex items-center justify-between gap-3">
              <legend className="sr-only">
                {sign.question[0]}
                {sign.question[1]}
              </legend>
              <p className="text-ink text-sm" aria-hidden="true">
                <strong>{sign.question[0]}</strong>
                {sign.question[1]}
              </p>
              <div className="border-ink-muted/20 flex shrink-0 rounded-2xl border p-1">
                {[true, false].map((option) => (
                  <label
                    key={String(option)}
                    className={cn(
                      'cursor-pointer rounded-xl px-4 py-2 text-sm font-bold has-focus-visible:ring-2',
                      option === yes
                        ? option
                          ? 'bg-move text-move-ink'
                          : 'bg-mint text-pine'
                        : 'text-ink-muted',
                    )}
                  >
                    <input
                      type="radio"
                      name={sign.id}
                      checked={option === yes}
                      onChange={() => answer(sign.id, option)}
                      className="sr-only"
                    />
                    {option ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </fieldset>
          )
        })}
      </div>

      <fieldset>
        <legend className="text-ink mb-2 font-bold">Mood</legend>
        <div className="flex justify-between gap-2">
          {moods.map((m) => (
            <label key={m.id} className="flex cursor-pointer flex-col items-center gap-1.5">
              <input
                type="radio"
                name="mood"
                checked={mood === m.id}
                onChange={() => setMoodChoice(m.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'ring-pine ring-offset-cream block size-14 rounded-full ring-offset-2 peer-focus-visible:ring-2',
                  m.face,
                  mood === m.id && 'ring-2',
                )}
              >
                <MoodFace mouth={m.mouth} />
              </span>
              <span className="text-ink-muted text-xs font-medium">{m.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="bg-pine hover:bg-ink w-full rounded-2xl py-4 text-lg font-bold text-white"
      >
        Save check-in
      </button>
      <CareDisclaimer />
    </form>
  )
}
