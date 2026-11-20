import { useCallback } from 'react'
import { useNoteStore } from '../store/useNoteStore'
import { useUndoableDelete } from './useUndoableDelete'

export function useNoteDelete() {
  const remove = useNoteStore((state) => state.removeNote)
  const restore = useNoteStore((state) => state.restoreNote)
  const { headingRef, handleDelete: deleteItem } = useUndoableDelete({ noun: 'Note', remove, restore })

  const handleDelete = useCallback(({ id = '', title = '' } = {}) => deleteItem({ id, name: title }), [deleteItem])

  return { headingRef, handleDelete }
}
