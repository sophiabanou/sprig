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
  With projectId, new notes belong to that project. With shouldFocusOnOpen, opening a note always moves focus into it,
  for layouts where the editor replaces the list on every screen size. With shouldDeferFocus, going back leaves focus
  alone until the caller runs restoreFocus, for a list that animates back in.
*/
export function useNoteSelection(
  notes = [],
  { projectId = null, headingRef: givenHeadingRef = null, shouldFocusOnOpen = false, shouldDeferFocus = false } = {},
) {
  const addNote = useNoteStore((state) => state.addNote)
  const discardIfBlank = useNoteStore((state) => state.discardIfBlank)
  const { headingRef, handleDelete } = useNoteDelete({ headingRef: givenHeadingRef })
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

  const restoreFocus = useCallback(() => {
    if (!returnFocusIdRef.current) return
    const row = listRef.current?.querySelector(`[data-note-id="${returnFocusIdRef.current}"]`)
    returnFocusIdRef.current = null
    const target = row ?? headingRef.current
    target?.focus()
  }, [headingRef])

  useEffect(() => {
    if (!isEditorOpen && !shouldDeferFocus) restoreFocus()
  }, [isEditorOpen, shouldDeferFocus, restoreFocus])

  const openNote = useCallback(
    (id = null, shouldFocus = false) => {
      if (selectedIdRef.current !== id) discardIfBlank(selectedIdRef.current)
      setSelectedId(id)
      setAutoFocusId(shouldFocus ? id : null)
      setIsEditorOpen(true)
    },
    [discardIfBlank],
  )

  const handleNew = useCallback(() => openNote(addNote({ projectId }), true), [addNote, projectId, openNote])

  const handleSelect = useCallback(
    (note = {}) => openNote(note.id, shouldFocusOnOpen || isCompact()),
    [openNote, shouldFocusOnOpen],
  )

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
    restoreFocus,
  }
}
