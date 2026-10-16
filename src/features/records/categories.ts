export const categories = [
  { id: 'lab', label: 'Lab results', emoji: '🧪', tile: 'bg-meditate' },
  { id: 'imaging', label: 'Scans & imaging', emoji: '🩻', tile: 'bg-sleep' },
  { id: 'prescription', label: 'Prescriptions', emoji: '💊', tile: 'bg-move' },
  { id: 'discharge', label: 'Discharge summaries', emoji: '🏥', tile: 'bg-reflect' },
  { id: 'letter', label: "Doctors' letters", emoji: '✉️', tile: 'bg-mint' },
  { id: 'vaccination', label: 'Vaccinations', emoji: '💉', tile: 'bg-meditate' },
  { id: 'insurance', label: 'Insurance', emoji: '🛡️', tile: 'bg-sleep' },
  { id: 'other', label: 'Other', emoji: '📄', tile: 'bg-cream' },
] as const

export type CategoryId = (typeof categories)[number]['id']

export const categoryInfo = (id: CategoryId) => categories.find((c) => c.id === id) ?? categories[7]

export const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const MAX_FILE_BYTES = 15 * 1024 * 1024

export const recordDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
