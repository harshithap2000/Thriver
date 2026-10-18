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
  /** Shown instead of the sprout on the tile. */
  emoji?: string
  /** Written for life after cancer treatment. */
  forSurvivors?: boolean
  /** Gentle guidance shown in turn during the session (one every 30 seconds). */
  cues?: readonly string[]
}

export const sessions: readonly MeditationSession[] = [
  {
    id: 'before-scan',
    title: 'Before your scan',
    description: 'Calm “scanxiety” before tests and results',
    minutes: 5,
    pattern: [4, 2, 6, 0],
    tile: 'bg-sleep',
    emoji: '🩻',
    forSurvivors: true,
    cues: [
      'It’s normal to feel nervous before a scan or results.',
      'Let your feet feel the floor. You are here, right now.',
      'You don’t need to know the result yet. Just this breath.',
      'If a “what if” arrives, notice it, and come back to the breath.',
      'Whatever the result, you won’t face it alone.',
      'Breathe out a little longer than you breathe in.',
    ],
  },
  {
    id: 'fear-of-recurrence',
    title: 'When fear of recurrence visits',
    description: 'Notice the worry, come back to now',
    minutes: 7,
    pattern: [4, 0, 6, 2],
    tile: 'bg-reflect',
    emoji: '🌧️',
    forSurvivors: true,
    cues: [
      'Fear of cancer coming back is very common. It doesn’t mean something is wrong.',
      'Name it gently: “This is fear.”',
      'Where do you feel it in your body? Breathe towards that place.',
      'Thoughts are not facts. Let this one pass like a cloud.',
      'Come back to what you can see, hear and touch right now.',
      'If worries keep returning, talk to your care team. Support helps.',
    ],
  },
  {
    id: 'sleep-hard-day',
    title: 'Sleep after a hard day',
    description: 'Body scan for treatment tiredness',
    minutes: 10,
    pattern: [4, 0, 7, 2],
    tile: 'bg-meditate',
    emoji: '🛏️',
    forSurvivors: true,
    cues: [
      'Let the bed hold you. There is nothing to do now.',
      'Soften your forehead, your jaw, your shoulders.',
      'Let your arms grow heavy.',
      'Let your belly rise and fall on its own.',
      'Let your legs and feet rest.',
      'Today was hard. Rest is part of recovery.',
    ],
  },
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
