import { useCallback } from 'react'

const KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 }

/* Arrow keys move between tabs and wrap around, Home and End jump to the ends. The focused tab is selected right away. */
export function useTabNavigation({ ids = [], activeId = '', onChange } = {}) {
  return useCallback(
    (event) => {
      const currentIndex = ids.indexOf(activeId)
      let nextIndex = null

      if (event.key in KEY_STEPS) nextIndex = (currentIndex + KEY_STEPS[event.key] + ids.length) % ids.length
      if (event.key === 'Home') nextIndex = 0
      if (event.key === 'End') nextIndex = ids.length - 1
      if (nextIndex === null) return

      event.preventDefault()
      onChange?.(ids[nextIndex])
      event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus()
    },
    [ids, activeId, onChange],
  )
}
