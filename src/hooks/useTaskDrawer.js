import { useCallback, useState } from 'react'
import { useFormDrawer } from './useFormDrawer'

/* The drawer that adds or edits a task. onDone gets the saved task, so a page can show the list it landed in. */
export function useTaskDrawer({ onDone } = {}) {
  const { isOpen, formKey, handleOpen, handleClose, handleClosed, closeWithMessage } = useFormDrawer()
  const [editingTask, setEditingTask] = useState(null)

  const handleNew = useCallback(() => {
    setEditingTask(null)
    handleOpen()
  }, [handleOpen])

  const handleEdit = useCallback(
    (task = {}) => {
      setEditingTask(task)
      handleOpen()
    },
    [handleOpen],
  )

  const handleAdd = useCallback(
    (task = {}) => {
      onDone?.(task)
      closeWithMessage(`Task added: ${task.title.trim()}`)
    },
    [onDone, closeWithMessage],
  )

  const handleSave = useCallback(
    (task = {}) => {
      onDone?.(task)
      closeWithMessage(`Task updated: ${task.title}`)
    },
    [onDone, closeWithMessage],
  )

  return { isOpen, formKey, editingTask, handleNew, handleEdit, handleAdd, handleSave, handleClose, handleClosed }
}
