import { useEffect, useRef } from 'react'

/* Moves focus to the page heading after navigation, but not on the first load. */
export function useRouteFocus(route = '') {
  const containerRef = useRef(null)
  const isFirstRunRef = useRef(true)

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      return
    }
    containerRef.current?.querySelector('h1')?.focus()
  }, [route])

  return containerRef
}
