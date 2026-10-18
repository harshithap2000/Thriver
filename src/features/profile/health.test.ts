import { emptyHealth, personalise, relevance, weeksSince, type HealthProfile } from './health'

const breast: HealthProfile = {
  ...emptyHealth,
  cancerType: 'breast',
  conditions: ['lymphoedema'],
  treatments: ['surgery'],
}

describe('personalisation', () => {
  it('scores matching content and flags content meant for others', () => {
    expect(relevance(undefined, breast)).toBe(0)
    expect(relevance({ cancerTypes: ['breast'] }, breast)).toBe(3)
    expect(relevance({ cancerTypes: ['breast'], conditions: ['lymphoedema'] }, breast)).toBe(5)
    expect(relevance({ cancerTypes: ['colorectal'], conditions: ['stoma'] }, breast)).toBe(-1)
  })

  it('puts matches first, keeps general content, and hides content for others', () => {
    const items = [
      { id: 'general' },
      { id: 'stoma', audience: { conditions: ['stoma' as const] } },
      { id: 'bra', audience: { cancerTypes: ['breast' as const] } },
    ]
    const result = personalise(items, breast)
    expect(result.items.map((i) => [i.id, i.forYou])).toEqual([
      ['bra', true],
      ['general', false],
    ])
    expect(result.hidden.map((i) => i.id)).toEqual(['stoma'])
  })

  it('shows everything when no profile is set', () => {
    const result = personalise(
      [{ id: 'a', audience: { cancerTypes: ['lung' as const] } }],
      emptyHealth,
    )
    expect(result.items).toHaveLength(1)
    expect(result.hidden).toHaveLength(0)
  })

  it('counts weeks since surgery', () => {
    expect(weeksSince('2026-09-23', new Date(2026, 9, 17))).toBe(3)
    expect(weeksSince(null)).toBeNull()
    expect(weeksSince('2027-01-01', new Date(2026, 9, 17))).toBeNull()
  })
})
