import { routines, routineSeconds, stepAt } from './routines'

const deskBreak = routines.find((r) => r.id === 'desk-break')!

describe('routines', () => {
  it('keeps every routine short', () => {
    for (const r of routines) expect(routineSeconds(r)).toBeLessThanOrEqual(8 * 60)
  })

  it('finds the current step and time left in it', () => {
    expect(stepAt(deskBreak, 0)).toMatchObject({ index: 0, remaining: 20 })
    expect(stepAt(deskBreak, 25)).toMatchObject({ index: 1, start: 20, remaining: 25 })
    expect(stepAt(deskBreak, routineSeconds(deskBreak))).toMatchObject({ index: 5, remaining: 0 })
  })
})
