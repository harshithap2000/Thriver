import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { dateKey } from '@/shared/utils/date'

import type { PhaseId } from './phases'
import type { WarningSignId } from './warningSigns'

export interface SymptomCheckIn {
  /** 0–10 */
  tiredness: number
  /** 0–10 */
  pain: number
  /** Warning signs answered "yes". */
  warnings: WarningSignId[]
}

export type ClearanceMethod = 'note' | 'told'

export interface Clearance {
  method: ClearanceMethod
  /** ISO timestamp when it was recorded. */
  at: string
  /** Who cleared the person, e.g. "Dr Rao, physiotherapist". */
  by: string
  /** The signed note saved in Records. */
  recordId?: string
}

interface RecoveryState {
  /** One symptom check-in per day, keyed by date. */
  checkIns: Record<string, SymptomCheckIn>
  /** Care-team clearances for phases 2–4. */
  clearances: Partial<Record<PhaseId, Clearance>>
  /** Plan items ticked off, per day. */
  planDone: Record<string, string[]>
  saveCheckIn: (checkIn: SymptomCheckIn, date?: string) => void
  clearPhase: (phase: PhaseId, clearance: Omit<Clearance, 'at'>) => void
  togglePlanItem: (id: string, date?: string) => void
}

export const useRecoveryStore = create<RecoveryState>()(
  persist(
    (set) => ({
      checkIns: {},
      clearances: {},
      planDone: {},
      saveCheckIn: (checkIn, date = dateKey()) =>
        set((s) => ({ checkIns: { ...s.checkIns, [date]: checkIn } })),
      clearPhase: (phase, clearance) =>
        set((s) => ({
          clearances: {
            ...s.clearances,
            [phase]: { ...clearance, at: new Date().toISOString() },
          },
        })),
      togglePlanItem: (id, date = dateKey()) =>
        set((s) => {
          const done = s.planDone[date] ?? []
          return {
            planDone: {
              ...s.planDone,
              [date]: done.includes(id) ? done.filter((d) => d !== id) : [...done, id],
            },
          }
        }),
    }),
    { name: 'thriver-recovery' },
  ),
)

/** The latest phase the person has been cleared for (phases unlock in order). */
export function currentPhase(clearances: Partial<Record<PhaseId, Clearance>>): PhaseId {
  if (!clearances[2]) return 1
  if (!clearances[3]) return 2
  if (!clearances[4]) return 3
  return 4
}

export const useCurrentPhase = () => useRecoveryStore((s) => currentPhase(s.clearances))

export const useTodaysCheckIn = () => useRecoveryStore((s) => s.checkIns[dateKey()])

/** Exercise is paused for the day when today's check-in reported a warning sign. */
export const usePausedToday = () =>
  useRecoveryStore((s) => (s.checkIns[dateKey()]?.warnings.length ?? 0) > 0)
