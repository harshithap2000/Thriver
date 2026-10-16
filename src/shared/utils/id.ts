/**
 * Short unique id for locally created records. Avoids crypto.randomUUID, which browsers only
 * expose on secure origins (it's missing when testing on a phone via http://192.168.x.x).
 */
export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
