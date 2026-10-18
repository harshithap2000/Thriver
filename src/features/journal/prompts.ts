export const prompts = [
  'What is one thing that made you smile today?',
  'What are three things you are grateful for right now?',
  'What is weighing on your mind, and what is one small step you could take?',
  'Describe a moment today when you felt calm.',
  'What did you learn about yourself this week?',
  'Who made a difference to your day, and how?',
  'What would you tell a friend who felt the way you feel today?',
  'What is something you are looking forward to?',
  'Which feeling showed up most today? Where did you notice it in your body?',
  'What is one kind thing you did for yourself recently?',
  'What drained your energy today, and what restored it?',
  'If today had a title, what would it be?',
  'What does “normal” feel like for me now?',
  'One thing my body did well this week…',
  'What would I tell someone just starting treatment?',
  'What has cancer taught me about what matters to me?',
  'When fear shows up, what helps me feel steady?',
  'What is one thing I can do again now that I couldn’t a month ago?',
] as const

/** A different prompt each day, offset by `skip` when the user asks for another. */
export function promptFor(date: Date, skip = 0) {
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  )
  return prompts[(dayNumber + skip) % prompts.length]!
}
