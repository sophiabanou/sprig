import { useCallback } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { useUndoableDelete } from './useUndoableDelete'

export function useTaskDelete({ headingRef: givenHeadingRef = null } = {}) {
  const remove = useTaskStore((state) => state.removeTask)
  const restore = useTaskStore((state) => state.restoreTask)
  const { headingRef, handleDelete: deleteItem } = useUndoableDelete({
    noun: 'Task',
    remove,
    restore,
    headingRef: givenHeadingRef,
  })

  const handleDelete = useCallback(({ id = '', title = '' } = {}) => deleteItem({ id, name: title }), [deleteItem])

  return { headingRef, handleDelete }
}
