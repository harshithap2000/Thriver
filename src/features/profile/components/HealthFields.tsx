import { inputClass } from '@/shared/ui/Field'
import { cn } from '@/shared/utils/cn'
import { dateKey } from '@/shared/utils/date'

import { cancerTypes, conditions, treatments, type HealthProfile } from '../health'

const chip = (on: boolean) =>
  cn(
    'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
    on ? 'bg-pine text-white' : 'bg-white text-ink shadow-sm hover:bg-mint',
  )

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

interface Props {
  value: HealthProfile
  onChange: (value: HealthProfile) => void
}

export function CancerFields({ value, onChange }: Props) {
  const hasSurgery = value.treatments.includes('surgery')
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-ink mb-2 text-sm font-bold">Type of cancer</legend>
        <div className="flex flex-wrap gap-2">
          {cancerTypes.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={value.cancerType === c.id}
              onClick={() =>
                onChange({ ...value, cancerType: value.cancerType === c.id ? null : c.id })
              }
              className={chip(value.cancerType === c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-ink mb-2 text-sm font-bold">
          Treatments you’ve had or are having
        </legend>
        <div className="flex flex-wrap gap-2">
          {treatments.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={value.treatments.includes(t.id)}
              onClick={() => {
                const next = toggle(value.treatments, t.id)
                onChange({
                  ...value,
                  treatments: next,
                  surgeryDate: next.includes('surgery') ? value.surgeryDate : null,
                })
              }}
              className={chip(value.treatments.includes(t.id))}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {hasSurgery && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="surgery-date" className="text-ink text-sm font-bold">
            Date of your (most recent) surgery
          </label>
          <input
            id="surgery-date"
            type="date"
            max={dateKey()}
            value={value.surgeryDate ?? ''}
            onChange={(e) => onChange({ ...value, surgeryDate: e.target.value || null })}
            className={inputClass}
          />
        </div>
      )}
    </div>
  )
}

export function ConditionFields({ value, onChange }: Props) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Things your care team mentioned</legend>
      {conditions.map((c) => {
        const on = value.conditions.includes(c.id)
        return (
          <label
            key={c.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 shadow-sm',
              on && 'ring-pine ring-2',
            )}
          >
            <input
              type="checkbox"
              checked={on}
              onChange={() => onChange({ ...value, conditions: toggle(value.conditions, c.id) })}
              className="accent-pine size-5"
            />
            <span className="text-ink">{c.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

export function AiConsentToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-2xl bg-white p-4 shadow-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-pine row-span-2 mt-1 size-5"
      />
      <span className="text-ink font-bold">Personalise my picks with AI</span>
      <span className="text-ink-muted text-sm">
        Thriver’s AI (Claude, by Anthropic) picks the guides and products most useful for you. It
        receives your cancer type, treatments, conditions and weeks since surgery, never your name
        or records. You can turn this off any time in Profile.
      </span>
    </label>
  )
}
