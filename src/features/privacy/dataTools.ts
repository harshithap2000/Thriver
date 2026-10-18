import { allFiles, deleteAllFiles } from '@/features/records'

/** Every app setting and entry lives in localStorage under this prefix. */
const PREFIX = 'thriver-'

function storedKeys() {
  return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX))
}

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsDataURL(blob)
  })

/** Everything Thriver stores on this device, as one JSON-ready object. */
export async function collectAllData() {
  const data: Record<string, unknown> = {}
  for (const key of storedKeys()) {
    const raw = localStorage.getItem(key)
    try {
      data[key] = raw === null ? null : (JSON.parse(raw) as unknown)
    } catch {
      data[key] = raw
    }
  }
  const files: Record<string, string> = {}
  for (const [id, blob] of await allFiles()) files[id] = await blobToDataUrl(blob)
  return { exportedAt: new Date().toISOString(), app: 'Thriver', data, recordFiles: files }
}

/** Downloads everything as a JSON file. */
export async function downloadAllData() {
  const json = JSON.stringify(await collectAllData(), null, 2)
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `thriver-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Removes all of Thriver's data from this device. */
export async function deleteEverything() {
  for (const key of storedKeys()) localStorage.removeItem(key)
  await deleteAllFiles()
}
