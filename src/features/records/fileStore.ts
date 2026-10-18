import { clear, createStore, del, entries, get, set } from 'idb-keyval'

/**
 * Record files are kept in IndexedDB (localStorage is too small for PDFs and photos).
 * Like the rest of the app's data, they never leave this device unless the user asks the
 * assistant about a record.
 */
const store = createStore('thriver-records', 'files')

export const saveFile = (id: string, file: Blob) => set(id, file, store)
export const loadFile = (id: string) => get<Blob>(id, store)
export const deleteFile = (id: string) => del(id, store)
export const allFiles = () => entries<string, Blob>(store)
export const deleteAllFiles = () => clear(store)
