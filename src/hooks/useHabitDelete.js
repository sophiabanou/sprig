import { useCallback, useRef } from 'react'
import { useHabitStore } from '../store/useHabitStore'
import { useAnnouncerStore } from '../store/useAnnouncerStore'
import { useToastStore } from '../store/useToastStore'

/*
  Deletes a habit with its log and offers to undo it in a toast. Focus goes to the toast's Undo,
  and to the page heading when the toast closes, so it is never lost with the row.
*/
export function useHabitDelete() {
  const headingRef = useRef(null)
  const removeHabit = useHabitStore((state) => state.removeHabit)
  const restoreHabit = useHabitStore((state) => state.restoreHabit)
  const announce = useAnnouncerStore((state) => state.announce)
  const showToast = useToastStore((state) => state.showToast)

  const handleDelete = useCallback(
    ({ id = '', name = '' } = {}) => {
      const snapshot = removeHabit(id)
      if (!snapshot) return
      announce(`Habit deleted: ${name}`)
      showToast({
        message: `Habit deleted: ${name}`,
        actionLabel: 'Undo',
        returnFocus: headingRef.current,
        onAction: () => {
          restoreHabit(snapshot)
          announce(`Habit restored: ${name}`)
        },
      })
    },
    [removeHabit, restoreHabit, announce, showToast],
  )

  return { headingRef, handleDelete }
}
