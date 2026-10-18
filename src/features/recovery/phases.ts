import type { HealthProfile } from '@/features/profile'

/**
 * Recovery phases and daily plans. Placeholder content: it must be written or approved by
 * Thriver's clinical advisers before real patients rely on it (shown as "pending clinical review").
 * Later phases unlock only when the care team clears the person.
 */

export const phaseIds = [1, 2, 3, 4] as const
export type PhaseId = (typeof phaseIds)[number]

export interface PlanItem {
  id: string
  emoji: string
  title: string
  detail: string
  /** Where to do it, e.g. a Move routine. */
  to?: string
  /** Counts as active time in the clinician summary. */
  active?: boolean
}

export interface Phase {
  id: PhaseId
  name: string
  short: string
  summary: string
  /** What the care team is asked to confirm before this phase starts. */
  clearanceAsk: string
}

export const phases: readonly Phase[] = [
  {
    id: 1,
    name: 'Early recovery',
    short: 'Early',
    summary: 'Breathing, short walks, and your hospital’s instructions',
    clearanceAsk: '',
  },
  {
    id: 2,
    name: 'Return to activity',
    short: 'Return',
    summary: 'Gentle movement while you heal',
    clearanceAsk: 'confirm you can be a little more active each day',
  },
  {
    id: 3,
    name: 'Rebuild strength',
    short: 'Rebuild',
    summary: 'Light strength work and longer walks',
    clearanceAsk: 'confirm you can start strength training',
  },
  {
    id: 4,
    name: 'Thrive',
    short: 'Thrive',
    summary: 'Regular activity as part of everyday life',
    clearanceAsk: 'confirm you can build up to regular moderate exercise',
  },
]

export const phaseInfo = (id: PhaseId) => phases[id - 1]!

const protein: PlanItem = {
  id: 'protein',
  emoji: '🥣',
  title: 'Protein at every meal',
  detail: 'Dal, paneer, eggs, curd, fish or chicken',
}

const needsArmCare = (health: HealthProfile) =>
  health.cancerType === 'breast' || health.conditions.includes('lymphoedema')

export function planFor(phase: PhaseId, health: HealthProfile): PlanItem[] {
  const arm: PlanItem = needsArmCare(health)
    ? {
        id: 'arm',
        emoji: '🙆',
        title: 'Shoulder & arm mobility',
        detail: health.conditions.includes('lymphoedema')
          ? '7 min · lymphoedema-safe'
          : '7 min · gentle range',
        to: '/move?routine=arm-mobility',
        active: true,
      }
    : {
        id: 'stretch',
        emoji: '🧘',
        title: 'Gentle stretches',
        detail: '6 min · evening stretch',
        to: '/move?routine=evening-stretch',
        active: true,
      }

  switch (phase) {
    case 1:
      return [
        {
          id: 'breathe',
          emoji: '🌬️',
          title: 'Breathing exercise',
          detail: '5 min · helps your lungs after surgery',
          to: '/meditate',
        },
        {
          id: 'walk',
          emoji: '🚶',
          title: 'Short walks at home',
          detail: 'A few minutes, a few times a day',
          to: '/move',
          active: true,
        },
        {
          id: 'instructions',
          emoji: '🏥',
          title: 'Follow your hospital’s instructions',
          detail: 'Wound and drain care, lifting limits',
        },
      ]
    case 2:
      return [
        {
          id: 'walk',
          emoji: '🚶',
          title: 'Gentle walk',
          detail: '10 min · easy pace',
          to: '/move',
          active: true,
        },
        arm,
        protein,
      ]
    case 3:
      return [
        {
          id: 'walk',
          emoji: '🚶',
          title: 'Brisk walk',
          detail: '20 min · you can talk but not sing',
          to: '/move',
          active: true,
        },
        {
          id: 'strength',
          emoji: '💪',
          title: 'Light strength',
          detail: health.conditions.includes('bones')
            ? '15 min · only exercises your team approved'
            : '15 min · bands or water bottles',
          to: '/move',
          active: true,
        },
        protein,
      ]
    case 4:
      return [
        {
          id: 'active',
          emoji: '🏃',
          title: 'Moderate activity',
          detail: '30 min · building to 150 min a week',
          to: '/move',
          active: true,
        },
        {
          id: 'strength',
          emoji: '💪',
          title: 'Strength',
          detail: '2 days a week',
          to: '/move',
          active: true,
        },
        { ...protein, title: 'Protein and plants at every meal' },
      ]
  }
}

/** Safety notes that adapt exercises to the profile. */
export function adaptations(health: HealthProfile) {
  const notes: string[] = []
  if (health.conditions.includes('lymphoedema'))
    notes.push('Lymphoedema-safe arm work, built up gradually')
  if (health.conditions.includes('bones'))
    notes.push('No jumping or heavy lifting; ask your team before strength work')
  if (health.conditions.includes('neuropathy'))
    notes.push('Hold on to something steady for balance exercises')
  if (health.conditions.includes('stoma'))
    notes.push('Avoid heavy lifting and sit-ups; ask about a support belt')
  return notes
}

/** Days since a YYYY-MM-DD date, or null if missing or in the future. */
export function daysSince(date: string | null, today = new Date()) {
  if (!date) return null
  const [y = 0, m = 1, d = 1] = date.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const days = Math.round((now.getTime() - start.getTime()) / 86_400_000)
  return days < 0 ? null : days
}
