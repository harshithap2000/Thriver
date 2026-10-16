export const activityKinds = [
  { id: 'walk', label: 'Walk', emoji: '🚶' },
  { id: 'run', label: 'Run', emoji: '🏃' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'cycle', label: 'Cycle', emoji: '🚲' },
  { id: 'dance', label: 'Dance', emoji: '💃' },
  { id: 'swim', label: 'Swim', emoji: '🏊' },
  { id: 'other', label: 'Other', emoji: '✨' },
] as const

export type ActivityKind = (typeof activityKinds)[number]['id'] | 'routine'

export const kindInfo = (kind: ActivityKind) =>
  kind === 'routine' ? { label: 'Routine', emoji: '🤸' } : activityKinds.find((k) => k.id === kind)!
