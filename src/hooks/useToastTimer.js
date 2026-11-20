import { useCallback, useEffect, useRef } from 'react'

/*
  Calls onExpire once the toast has been on screen for duration. The clock pauses while the pointer is over
  the toast or keyboard focus is inside it, and resumes with the time that was left. A new key restarts the clock
  but keeps any hover or focus already there, such as the focus the toast takes when it appears.
*/
export function useToastTimer(key = null, duration = 0, onExpire) {
  const timeoutRef = useRef(null)
  const remainingRef = useRef(duration)
  const startedAtRef = useRef(0)
  const isHoveredRef = useRef(false)
  const isFocusedRef = useRef(false)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const start = useCallback(() => {
    clearTimeout(timeoutRef.current)
    startedAtRef.current = Date.now()
    timeoutRef.current = setTimeout(() => onExpireRef.current?.(), remainingRef.current)
  }, [])

  const pause = useCallback(() => {
    if (!timeoutRef.current) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    remainingRef.current -= Date.now() - startedAtRef.current
  }, [])

  const update = useCallback(() => {
    if (isHoveredRef.current || isFocusedRef.current) pause()
    else if (!timeoutRef.current) start()
  }, [pause, start])

  useEffect(() => {
    if (key === null) return undefined
    remainingRef.current = duration
    update()
    return () => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [key, duration, update])

  const handlePointerEnter = useCallback(() => {
    isHoveredRef.current = true
    update()
  }, [update])

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false
    update()
  }, [update])

  /* Only keyboard focus pauses, so focus left behind by a click does not hold the toast open forever */
  const handleFocus = useCallback(
    (event) => {
      isFocusedRef.current = event.target.matches(':focus-visible')
      update()
    },
    [update],
  )

  const handleBlur = useCallback(
    (event) => {
      if (event.currentTarget.contains(event.relatedTarget)) return
      isFocusedRef.current = false
      update()
    },
    [update],
  )

  return { handlePointerEnter, handlePointerLeave, handleFocus, handleBlur }
}
