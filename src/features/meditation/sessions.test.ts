import { formatClock, phaseAt, type BreathPattern } from './sessions'

describe('phaseAt', () => {
  const box: BreathPattern = [4, 4, 4, 4]

  it.each([
    [0, 'in', 4],
    [3, 'in', 1],
    [4, 'hold', 4],
    [8, 'out', 4],
    [12, 'rest', 4],
    [16, 'in', 4], // next cycle
  ])('at %is is "%s" with %is left', (elapsed, phase, remaining) => {
    expect(phaseAt(box, elapsed)).toMatchObject({ phase, remaining })
  })

  it('skips zero-length phases', () => {
    expect(phaseAt([4, 0, 6, 0], 4).phase).toBe('out')
    expect(phaseAt([4, 0, 6, 0], 10).phase).toBe('in')
  })
})

describe('formatClock', () => {
  it('formats minutes and seconds', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(65)).toBe('1:05')
    expect(formatClock(600)).toBe('10:00')
  })
})
