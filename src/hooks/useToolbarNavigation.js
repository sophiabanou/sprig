import { useCallback, useState } from 'react'

const KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 }

const getButtons = (toolbar) => [...toolbar.querySelectorAll('button')]

/*
  A toolbar is one tab stop. Arrow keys move between its buttons and wrap around, Home and End jump
  to the ends, and the last focused button is where Tab comes back to.
*/
export function useToolbarNavigation() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleFocus = useCallback((event) => {
    const index = getButtons(event.currentTarget).indexOf(event.target)
    if (index !== -1) setActiveIndex(index)
  }, [])

  const handleKeyDown = useCallback((event) => {
    const buttons = getButtons(event.currentTarget)
    const currentIndex = buttons.indexOf(event.target)
    let nextIndex = null

    if (event.key in KEY_STEPS) nextIndex = (currentIndex + KEY_STEPS[event.key] + buttons.length) % buttons.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = buttons.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    buttons[nextIndex]?.focus()
  }, [])

  return { activeIndex, handleFocus, handleKeyDown }
}
