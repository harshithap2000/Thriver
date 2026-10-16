export const moods = [
  { id: 'great', label: 'Great', face: 'bg-[#5dba9a]', mouth: 'smile' },
  { id: 'good', label: 'Good', face: 'bg-[#c2e6ab]', mouth: 'smile' },
  { id: 'okay', label: 'Okay', face: 'bg-[#fbe6ad]', mouth: 'flat' },
  { id: 'tired', label: 'Tired', face: 'bg-[#e4def2]', mouth: 'frown' },
  { id: 'stressed', label: 'Stressed', face: 'bg-[#f9c5bd]', mouth: 'frown' },
] as const

export type MoodId = (typeof moods)[number]['id']
export type Mouth = (typeof moods)[number]['mouth']
