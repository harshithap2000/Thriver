const pad = (n: number) => String(n).padStart(2, '0')

/** Local calendar date as YYYY-MM-DD. */
export const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** Parse a YYYY-MM-DD key as a local date (midnight). */
export function parseDateKey(key: string) {
  const [y = 0, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

/** Format a 24h "HH:MM" string in the user's locale, e.g. "8:30 AM". */
export function formatTime(hhmm: string) {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return timeFormat.format(new Date(2000, 0, 1, h, m))
}

/** Every date shown in a month view: whole weeks (Sunday first) covering the month. */
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks = Math.ceil((first.getDay() + daysInMonth) / 7)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i))
}
