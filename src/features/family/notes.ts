import { z } from 'zod'

export const stickers = ['💌', '🌻', '🧸', '🌈', '⭐', '🍪', '🐣', '💛', '🌙', '🦋'] as const

export const noteColors = ['bg-reflect', 'bg-move', 'bg-sleep', 'bg-meditate', 'bg-mint'] as const

export const MAX_MESSAGE = 280
export const MAX_FROM = 30

/** Shape of a note, also used to validate notes arriving in a link (untrusted input). */
export const familyNoteSchema = z.object({
  id: z.string().min(1).max(40),
  from: z.string().trim().min(1).max(MAX_FROM),
  message: z.string().trim().min(1).max(MAX_MESSAGE),
  sticker: z.enum(stickers),
  color: z.enum(noteColors),
  /** ISO timestamp */
  sentAt: z.iso.datetime(),
})

export type FamilyNote = z.infer<typeof familyNoteSchema>

/** Note → URL-safe base64 of its JSON (UTF-8 safe, so emoji and any language work). */
export function encodeNote(note: FamilyNote) {
  const bytes = new TextEncoder().encode(JSON.stringify(note))
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Inverse of encodeNote. Returns null for anything that isn't a valid note. */
export function decodeNote(encoded: string): FamilyNote | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const parsed = familyNoteSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

/** Absolute link that delivers `note` when opened. The note travels in the #fragment, which browsers never send to a server. */
export const noteLink = (note: FamilyNote, origin = window.location.origin) =>
  `${origin}/family/note#${encodeNote(note)}`

/** Link family members open to write a note. */
export const inviteLink = (name: string, origin = window.location.origin) =>
  `${origin}/family/write${name ? `?for=${encodeURIComponent(name)}` : ''}`
