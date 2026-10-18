import { addDays, dateKey } from '@/shared/utils/date'

/** Inputs, as stored by the other features. */
export interface SummaryInput {
  days: number
  today?: Date
  /** Ids of plan items that count as activity in the current phase. */
  activePlanIds: string[]
  planDone: Record<string, string[]>
  checkIns: Record<string, { tiredness: number; pain: number; warnings: string[] }>
  activities: { date: string; minutes: number }[]
  medications: { id: string; times: string[] }[]
  taken: Record<string, Record<string, string>>
}

export interface Trend {
  first: number
  last: number
}

const average = (values: number[]) =>
  values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null

/** Earlier half vs later half of the period; null without check-ins in both halves. */
function trend(values: (number | undefined)[]): Trend | null {
  const half = Math.floor(values.length / 2)
  const first = average(values.slice(0, half).filter((v) => v !== undefined))
  const last = average(values.slice(half).filter((v) => v !== undefined))
  return first === null || last === null ? null : { first, last }
}

/** A patient-reported recovery summary for the last `days` days, ending today. */
export function buildSummary(input: SummaryInput) {
  const today = input.today ?? new Date()
  const dates = Array.from({ length: input.days }, (_, i) =>
    dateKey(addDays(today, i - input.days + 1)),
  )
  const inRange = new Set(dates)

  const minutes: Record<string, number> = {}
  for (const a of input.activities)
    if (inRange.has(a.date)) minutes[a.date] = (minutes[a.date] ?? 0) + a.minutes
  const dailyMinutes = dates.map((d) => ({ date: d, minutes: minutes[d] ?? 0 }))

  const planned = input.activePlanIds.length * dates.length
  const sessionsDone = dates.reduce(
    (sum, d) =>
      sum + (input.planDone[d] ?? []).filter((id) => input.activePlanIds.includes(id)).length,
    0,
  )

  const dosesPerDay = input.medications.reduce((sum, m) => sum + m.times.length, 0)
  const dosesTaken = dates.reduce((sum, d) => sum + Object.keys(input.taken[d] ?? {}).length, 0)

  const checkIns = dates.map((d) => input.checkIns[d])
  const alerts = dates.flatMap((d) => {
    const warnings = input.checkIns[d]?.warnings ?? []
    return warnings.length ? [{ date: d, warnings }] : []
  })

  return {
    from: dates[0]!,
    to: dates.at(-1)!,
    sessions: { done: Math.min(sessionsDone, planned), planned },
    activeMinutes: dailyMinutes.reduce((sum, d) => sum + d.minutes, 0),
    dailyMinutes,
    doses: dosesPerDay
      ? { taken: Math.min(dosesTaken, dosesPerDay * dates.length), due: dosesPerDay * dates.length }
      : null,
    checkInCount: checkIns.filter(Boolean).length,
    tiredness: trend(checkIns.map((c) => c?.tiredness)),
    pain: trend(checkIns.map((c) => c?.pain)),
    swellingDays: alerts.filter((a) => a.warnings.includes('swelling')).length,
    alerts,
  }
}

export type Summary = ReturnType<typeof buildSummary>

export const percent = (part: number, whole: number) =>
  whole ? `${Math.round((part / whole) * 100)}%` : '—'
