/** Seconds for each part of one breath: in, hold, out, rest (hold after exhale). */
export type BreathPattern = readonly [inhale: number, hold: number, exhale: number, rest: number]

export interface MeditationSession {
  id: string
  title: string
  description: string
  minutes: number
  pattern: BreathPattern
  /** Tile background token. */
  tile: string
}

export const sessions: readonly MeditationSession[] = [
  {
    id: 'reset-1',
    title: 'One-Minute Reset',
    description: 'Box breathing to steady yourself',
    minutes: 1,
    pattern: [4, 4, 4, 4],
    tile: 'bg-reflect',
  },
  {
    id: 'calm-3',
    title: 'Calm the Nerves',
    description: '4-7-8 breathing for anxious moments',
    minutes: 3,
    pattern: [4, 7, 8, 0],
    tile: 'bg-move',
  },
  {
    id: 'breathing-5',
    title: '5-Minute Mindful Breathing',
    description: 'A quick reset for your day',
    minutes: 5,
    pattern: [4, 0, 6, 0],
    tile: 'bg-meditate',
  },
  {
    id: 'sleep-10',
    title: 'Wind Down for Sleep',
    description: 'Long, slow exhales to relax your body',
    minutes: 10,
    pattern: [4, 0, 8, 2],
    tile: 'bg-sleep',
  },
]

export const findSession = (id: string | null) => sessions.find((s) => s.id === id)

export type BreathPhase = 'in' | 'hold' | 'out' | 'rest'

export const phaseLabels: Record<BreathPhase, string> = {
  in: 'Breathe in',
  hold: 'Hold',
  out: 'Breathe out',
  rest: 'Rest',
}

/** Which part of the breath cycle we're in after `elapsed` seconds. */
export function phaseAt(pattern: BreathPattern, elapsed: number) {
  const phases: BreathPhase[] = ['in', 'hold', 'out', 'rest']
  const cycle = pattern.reduce((a, b) => a + b, 0)
  let t = elapsed % cycle
  for (const [i, duration] of pattern.entries()) {
    if (t < duration) return { phase: phases[i]!, duration, remaining: duration - t }
    t -= duration
  }
  // Unreachable for a valid pattern; fall back to the start of a breath.
  return { phase: 'in' as const, duration: pattern[0], remaining: pattern[0] }
}

/** "4:05" */
export const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
