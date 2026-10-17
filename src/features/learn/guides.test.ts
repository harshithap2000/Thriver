import { guides, topics } from './guides'

describe('learn guides', () => {
  it('have unique slugs, known topics and https sources', () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length)
    const topicIds = new Set<string>(topics.map((t) => t.id))
    for (const g of guides) {
      expect(topicIds.has(g.topic)).toBe(true)
      expect(g.sources.length).toBeGreaterThan(0)
      for (const s of g.sources) expect(s.url).toMatch(/^https:\/\//)
      expect(g.body.length).toBeGreaterThan(0)
    }
  })
})
