import type { HealthProfile } from '@/features/profile'

/**
 * Warning-sign questions for the daily check-in. Placeholder rules pending clinical review: any
 * "yes" pauses exercise for the day and shows who to contact.
 */

export type WarningSignId = 'fever' | 'swelling' | 'wound' | 'breathless'

export interface WarningSign {
  id: WarningSignId
  /** Bold part of the question, then the rest. */
  question: [string, string]
  /** Shown on the alert screen. */
  explanation: string
  /** Go to emergency care rather than wait for the care team. */
  urgent?: boolean
}

export function warningSignsFor(health: HealthProfile): WarningSign[] {
  const signs: WarningSign[] = [
    {
      id: 'fever',
      question: ['Fever', ' 38°C or higher?'],
      explanation:
        'You reported a fever of 38°C or higher. During recovery this can be a sign of infection, so it’s important to tell your care team today.',
    },
    {
      id: 'swelling',
      question:
        health.cancerType === 'breast' || health.conditions.includes('lymphoedema')
          ? ['New swelling', ' in your arm or chest?']
          : ['New swelling', ', redness or heat in an arm or leg?'],
      explanation:
        'You reported new swelling. It can be a sign of lymphoedema, infection or a blood clot, so your care team should check it today.',
    },
  ]
  if (health.treatments.includes('surgery'))
    signs.push({
      id: 'wound',
      question: ['Your wound', ' red, hot, leaking or bleeding?'],
      explanation:
        'You reported a change in your wound. It may need to be checked for infection, so please tell your care team today.',
    })
  signs.push({
    id: 'breathless',
    question: ['Breathless', ' at rest, or chest pain?'],
    explanation:
      'Breathlessness at rest or chest pain needs urgent attention. If it is severe or getting worse, call an ambulance now.',
    urgent: true,
  })
  return signs
}

/** India's emergency numbers. */
export const emergencyNumbers = [
  { label: 'Emergency', number: '112' },
  { label: 'Ambulance', number: '108' },
] as const
