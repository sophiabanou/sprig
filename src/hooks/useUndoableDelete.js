import { useCallback, useRef } from 'react'
import { useAnnouncerStore } from '../store/useAnnouncerStore'
import { useToastStore } from '../store/useToastStore'

/*
  Deletes an item and offers to undo it in a toast. remove returns a snapshot, or null when nothing
  was removed, and restore takes that snapshot back. Focus goes to the toast's Undo, and to the page
  heading when the toast closes, so it is never lost with the row. Pass headingRef to return focus to a heading of your own.
*/
export function useUndoableDelete({ noun = '', remove, restore, headingRef: givenHeadingRef = null } = {}) {
  const ownHeadingRef = useRef(null)
  const headingRef = givenHeadingRef ?? ownHeadingRef
  const announce = useAnnouncerStore((state) => state.announce)
  const showToast = useToastStore((state) => state.showToast)

  const handleDelete = useCallback(
    ({ id = '', name = '' } = {}) => {
      const snapshot = remove?.(id)
      if (!snapshot) return
      announce(`${noun} deleted: ${name}`)
      showToast({
        message: `${noun} deleted: ${name}`,
        actionLabel: 'Undo',
        returnFocus: headingRef.current,
        onAction: () => {
          restore?.(snapshot)
          announce(`${noun} restored: ${name}`)
        },
      })
    },
    [noun, remove, restore, announce, showToast],
  )

  return { headingRef, handleDelete }
}
