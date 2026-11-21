import { useCallback, useEffect, useRef, useState } from 'react'
import { useNoteStore } from '../store/useNoteStore'
import { getNoteTitle } from '../utils/notes'
import { useNoteDelete } from './useNoteDelete'

/* Matches the breakpoint in the notes CSS where the list and the editor take turns */
const COMPACT_QUERY = '(max-width: 768px)'

const isCompact = () => window.matchMedia(COMPACT_QUERY).matches

/*
  Which note is open, for the note list and the editor beside it. Falls back to the newest note, drops
  a note left blank when another opens or the page closes, and on small screens tracks whether the editor
  is showing, returning focus to the note's row when going back to the list.
*/
export function useNoteSelection(notes = []) {
  const addNote = useNoteStore((state) => state.addNote)
  const discardIfBlank = useNoteStore((state) => state.discardIfBlank)
  const { headingRef, handleDelete } = useNoteDelete()
  const [selectedId, setSelectedId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [autoFocusId, setAutoFocusId] = useState(null)
  const listRef = useRef(null)
  const selectedIdRef = useRef(null)
  const returnFocusIdRef = useRef(null)

  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0] ?? null
  const currentId = selectedNote?.id ?? null

  useEffect(() => {
    selectedIdRef.current = currentId
  }, [currentId])

  useEffect(() => () => discardIfBlank(selectedIdRef.current), [discardIfBlank])

  useEffect(() => {
    if (isEditorOpen || !returnFocusIdRef.current) return
    const row = listRef.current?.querySelector(`[data-note-id="${returnFocusIdRef.current}"]`)
    returnFocusIdRef.current = null
    const target = row ?? headingRef.current
    target?.focus()
  }, [isEditorOpen, headingRef])

  const openNote = useCallback(
    (id = null, shouldFocus = false) => {
      if (selectedIdRef.current !== id) discardIfBlank(selectedIdRef.current)
      setSelectedId(id)
      setAutoFocusId(shouldFocus ? id : null)
      setIsEditorOpen(true)
    },
    [discardIfBlank],
  )

  const handleNew = useCallback(() => openNote(addNote(), true), [addNote, openNote])

  const handleSelect = useCallback((note = {}) => openNote(note.id, isCompact()), [openNote])

  const handleBack = useCallback(() => {
    returnFocusIdRef.current = selectedIdRef.current
    discardIfBlank(selectedIdRef.current)
    setIsEditorOpen(false)
  }, [discardIfBlank])

  const handleDeleteNote = useCallback(
    (note = {}) => {
      const index = notes.findIndex((item) => item.id === note.id)
      const nextNote = notes[index + 1] ?? notes[index - 1] ?? null
      handleDelete({ id: note.id, title: getNoteTitle(note.body) || 'New note' })
      setSelectedId(nextNote?.id ?? null)
      setIsEditorOpen(false)
    },
    [notes, handleDelete],
  )

  return {
    headingRef,
    listRef,
    selectedNote,
    currentId,
    isEditorOpen,
    autoFocusId,
    handleNew,
    handleSelect,
    handleBack,
    handleDeleteNote,
  }
}
