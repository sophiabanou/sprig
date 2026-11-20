import { useCallback, useRef } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { useAnnouncerStore } from '../store/useAnnouncerStore'
import { useToastStore } from '../store/useToastStore'

/*
  Deletes a task and offers to undo it in a toast. Focus goes to the toast's Undo,
  and to the page heading when the toast closes, so it is never lost with the row.
*/
export function useTaskDelete() {
  const headingRef = useRef(null)
  const removeTask = useTaskStore((state) => state.removeTask)
  const restoreTask = useTaskStore((state) => state.restoreTask)
  const announce = useAnnouncerStore((state) => state.announce)
  const showToast = useToastStore((state) => state.showToast)

  const handleDelete = useCallback(
    ({ id = '', title = '' } = {}) => {
      const snapshot = removeTask(id)
      if (!snapshot) return
      announce(`Task deleted: ${title}`)
      showToast({
        message: `Task deleted: ${title}`,
        actionLabel: 'Undo',
        returnFocus: headingRef.current,
        onAction: () => {
          restoreTask(snapshot)
          announce(`Task restored: ${title}`)
        },
      })
    },
    [removeTask, restoreTask, announce, showToast],
  )

  return { headingRef, handleDelete }
}
