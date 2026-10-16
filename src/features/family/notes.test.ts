import { decodeNote, encodeNote, inviteLink, noteLink, type FamilyNote } from './notes'

const note: FamilyNote = {
  id: 'abc-123',
  from: 'Amma',
  message: 'So proud of you, kanna! 💛 Eat well, sleep well. அன்புடன்',
  sticker: '🌻',
  color: 'bg-reflect',
  sentAt: '2026-10-16T09:30:00.000Z',
}

describe('family note links', () => {
  it('round-trips notes with emoji and non-Latin text', () => {
    const encoded = encodeNote(note)
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/) // URL safe
    expect(decodeNote(encoded)).toEqual(note)
  })

  it('rejects tampered or invalid payloads', () => {
    expect(decodeNote('not-base64!!')).toBeNull()
    expect(decodeNote(btoa('{"hello":"world"}'))).toBeNull()
    expect(decodeNote(encodeNote({ ...note, message: 'x'.repeat(500) }))).toBeNull()
    expect(decodeNote(encodeNote({ ...note, sticker: '💀' as never }))).toBeNull()
  })

  it('builds note and invite links', () => {
    expect(noteLink(note, 'https://thriver.app')).toMatch(/^https:\/\/thriver\.app\/family\/note#/)
    expect(inviteLink('Harshitha P', 'https://thriver.app')).toBe(
      'https://thriver.app/family/write?for=Harshitha%20P',
    )
  })
})
