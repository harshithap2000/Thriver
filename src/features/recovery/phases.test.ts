import { emptyHealth } from '@/features/profile'

import { adaptations, daysSince, planFor } from './phases'
import { currentPhase } from './useRecoveryStore'

const breast = {
  ...emptyHealth,
  cancerType: 'breast' as const,
  treatments: ['surgery' as const],
  conditions: ['lymphoedema' as const],
}

describe('recovery phases', () => {
  it('unlocks phases in order as the care team clears them', () => {
    const cleared = { method: 'told' as const, at: '2026-10-01T00:00:00Z', by: 'Dr Rao' }
    expect(currentPhase({})).toBe(1)
    expect(currentPhase({ 2: cleared })).toBe(2)
    expect(currentPhase({ 2: cleared, 3: cleared })).toBe(3)
    // A later clearance without the earlier one doesn't skip ahead.
    expect(currentPhase({ 3: cleared })).toBe(1)
  })

  it('adapts the plan to the profile', () => {
    const plan = planFor(2, breast)
    expect(plan.map((i) => i.title)).toEqual([
      'Gentle walk',
      'Shoulder & arm mobility',
      'Protein at every meal',
    ])
    expect(plan[1]!.detail).toContain('lymphoedema-safe')
    expect(planFor(2, emptyHealth)[1]!.title).toBe('Gentle stretches')
    expect(adaptations({ ...breast, conditions: ['bones'] })).toEqual([
      expect.stringContaining('No jumping'),
    ])
  })

  it('counts days since surgery', () => {
    const today = new Date(2026, 9, 16, 15, 0)
    expect(daysSince('2026-09-23', today)).toBe(23)
    expect(daysSince('2026-10-16', today)).toBe(0)
    expect(daysSince('2026-10-20', today)).toBeNull()
    expect(daysSince(null, today)).toBeNull()
  })
})
