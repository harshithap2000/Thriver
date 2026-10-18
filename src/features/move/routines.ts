export interface MoveStep {
  name: string
  /** One-line instruction. */
  cue: string
  seconds: number
}

export interface Routine {
  id: string
  title: string
  description: string
  tile: string
  steps: readonly MoveStep[]
}

export const routines: readonly Routine[] = [
  {
    id: 'arm-mobility',
    title: 'Shoulder & Arm Mobility',
    description: 'Gentle range of movement after surgery (pending clinical review)',
    tile: 'bg-sleep',
    steps: [
      { name: 'Deep breaths', cue: 'Sit tall, breathe slowly into your belly', seconds: 40 },
      {
        name: 'Shoulder shrugs',
        cue: 'Lift both shoulders to your ears, then let go',
        seconds: 40,
      },
      { name: 'Shoulder rolls', cue: 'Roll your shoulders slowly backwards', seconds: 40 },
      {
        name: 'Elbow bends',
        cue: 'Arms by your sides, bend and straighten your elbows',
        seconds: 40,
      },
      {
        name: 'Wall walk',
        cue: 'Face a wall and walk your fingers up only as far as is comfortable',
        seconds: 60,
      },
      {
        name: 'Hands behind head',
        cue: 'Lying down, rest hands behind your head and let elbows open slowly',
        seconds: 60,
      },
      { name: 'Rest', cue: 'Relax your arms and breathe. Stop if anything hurts', seconds: 40 },
    ],
  },
  {
    id: 'wake-up',
    title: 'Morning Wake-Up',
    description: 'Loosen up and get your blood flowing',
    tile: 'bg-reflect',
    steps: [
      { name: 'Neck rolls', cue: 'Slowly circle your head, then switch direction', seconds: 30 },
      { name: 'Shoulder rolls', cue: 'Roll your shoulders up, back and down', seconds: 30 },
      { name: 'Arm circles', cue: 'Arms out wide, small circles growing bigger', seconds: 30 },
      { name: 'Side stretch', cue: 'Reach one arm overhead and lean, then switch', seconds: 40 },
      { name: 'Forward fold', cue: 'Soft knees, let your upper body hang', seconds: 30 },
      { name: 'March in place', cue: 'Lift your knees and swing your arms', seconds: 60 },
    ],
  },
  {
    id: 'desk-break',
    title: 'Desk Break',
    description: 'Undo the hunch in three minutes',
    tile: 'bg-sleep',
    steps: [
      {
        name: 'Stand and reach',
        cue: 'Stand tall and reach both arms to the ceiling',
        seconds: 20,
      },
      { name: 'Chest opener', cue: 'Clasp hands behind you and lift your chest', seconds: 30 },
      { name: 'Seated twist', cue: 'Turn gently to one side, then the other', seconds: 40 },
      {
        name: 'Wrist circles',
        cue: 'Circle your wrists both ways, shake out your hands',
        seconds: 30,
      },
      { name: 'Calf raises', cue: 'Rise onto your toes and lower slowly', seconds: 40 },
      { name: 'Deep breaths', cue: 'Three slow breaths before you sit back down', seconds: 20 },
    ],
  },
  {
    id: 'gentle-yoga',
    title: 'Gentle Yoga Flow',
    description: 'Slow poses to stretch and steady',
    tile: 'bg-meditate',
    steps: [
      { name: 'Mountain pose', cue: 'Stand tall, feet grounded, breathe', seconds: 45 },
      { name: 'Cat-cow', cue: 'On hands and knees, arch then round your back', seconds: 60 },
      { name: "Child's pose", cue: 'Sit back on your heels, arms long, rest', seconds: 60 },
      {
        name: 'Low lunge',
        cue: 'Step one foot forward, sink your hips; switch halfway',
        seconds: 60,
      },
      { name: 'Seated forward bend', cue: 'Legs long, fold forward from the hips', seconds: 60 },
      {
        name: 'Lying twist',
        cue: 'On your back, drop both knees to one side; switch',
        seconds: 60,
      },
      { name: 'Rest', cue: 'Lie still and let your body feel heavy', seconds: 75 },
    ],
  },
  {
    id: 'evening-stretch',
    title: 'Evening Stretch',
    description: 'Release the day before bed',
    tile: 'bg-move',
    steps: [
      { name: 'Neck release', cue: 'Tilt an ear toward each shoulder', seconds: 40 },
      { name: 'Cross-body arm', cue: 'Pull one arm across your chest, then switch', seconds: 40 },
      {
        name: 'Hamstring stretch',
        cue: 'Seated, reach toward one foot, then the other',
        seconds: 60,
      },
      { name: 'Butterfly', cue: 'Soles of feet together, knees relaxed down', seconds: 45 },
      { name: 'Knees to chest', cue: 'On your back, hug your knees and rock gently', seconds: 45 },
      { name: 'Legs up the wall', cue: 'Rest your legs up a wall and breathe slowly', seconds: 70 },
    ],
  },
]

export const routineSeconds = (routine: Routine) =>
  routine.steps.reduce((sum, step) => sum + step.seconds, 0)

export const findRoutine = (id: string | null) => routines.find((r) => r.id === id)

/** The step being done `elapsed` seconds into a routine, and where it starts. */
export function stepAt(routine: Routine, elapsed: number) {
  let start = 0
  for (const [index, step] of routine.steps.entries()) {
    if (elapsed < start + step.seconds) {
      return { index, step, start, remaining: start + step.seconds - elapsed }
    }
    start += step.seconds
  }
  const index = routine.steps.length - 1
  const step = routine.steps[index]!
  return { index, step, start: start - step.seconds, remaining: 0 }
}
