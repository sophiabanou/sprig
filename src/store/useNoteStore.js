import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createDebouncedStorage } from '../utils/storage'
import { getNoteTitle } from '../utils/notes'

const NOTE_STORAGE = createDebouncedStorage()

export function isNoteBlank(note = {}) {
  return !getNoteTitle(note.body)
}

/* Version 1 kept the title apart from the body. From version 2 the first line of the body is the title. */
function migrate(persisted = {}, version = 0) {
  if (version >= 2) return persisted
  const notes = (persisted.notes ?? []).map(({ title = '', body = '', ...note }) => {
    const [firstLine = '', ...rest] = body.split('\n')
    const merged = title.trim() ? `# ${title.trim()}\n\n${body}` : `# ${firstLine}\n\n${rest.join('\n')}`
    return { ...note, body: merged.trim(), isPinned: false }
  })
  return { ...persisted, notes }
}

/* A note with no projectId is a simple note. Work notes will carry the id of their project. */
export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],

      addNote: ({ body = '', projectId = null } = {}) => {
        const now = Date.now()
        const note = { id: crypto.randomUUID(), body, projectId, isPinned: false, createdAt: now, updatedAt: now }
        set((state) => ({ notes: [...state.notes, note] }))
        return note.id
      },

      updateNote: (id, changes = {}) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, ...changes, updatedAt: Date.now() } : note)),
        })),

      /* Pinning is not an edit, so it leaves the note's date alone */
      togglePin: (id) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)),
        })),

      /* Drops a note left without any text, so opening a new note and leaving it adds nothing */
      discardIfBlank: (id) =>
        set((state) => {
          const note = state.notes.find((item) => item.id === id)
          if (!note || !isNoteBlank(note)) return state
          return { notes: state.notes.filter((item) => item.id !== id) }
        }),

      /* Returns a snapshot of the note and its place, so restoreNote can undo the removal */
      removeNote: (id) => {
        const { notes } = get()
        const index = notes.findIndex((note) => note.id === id)
        if (index === -1) return null

        set({ notes: notes.filter((note) => note.id !== id) })
        return { note: notes[index], index }
      },

      restoreNote: ({ note = null, index = 0 } = {}) =>
        set((state) => {
          if (!note || state.notes.some((item) => item.id === note.id)) return state
          const notes = [...state.notes]
          notes.splice(Math.min(index, notes.length), 0, note)
          return { notes }
        }),
    }),
    { name: 'todo-notes', version: 2, migrate, storage: createJSONStorage(() => NOTE_STORAGE) },
  ),
)
