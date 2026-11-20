import { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { getCollapsedState } from '../utils/collapse'
import { ENTRANCE, SWAP_DURATION } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Fades and collapses a row, then runs the callback that removes it. The last row of a list only fades,
  quickly, since the empty state takes its place. Further calls are ignored while it leaves,
  and focus stays put until the callback moves it.
*/
export function useRowExit() {
  const rowRef = useRef(null)
  const isExitingRef = useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const exit = useCallback(
    (onDone) => {
      const row = rowRef.current
      if (isExitingRef.current) return
      isExitingRef.current = true
      if (!row || prefersReducedMotion) {
        onDone?.()
        return
      }

      const isOnly = !row.previousElementSibling && !row.nextElementSibling
      if (isOnly) {
        gsap.to(row, { opacity: 0, duration: SWAP_DURATION, ease: 'power1.out', onComplete: onDone })
        return
      }

      gsap
        .timeline({ onComplete: onDone })
        .to(row, { opacity: 0, duration: ENTRANCE.fieldDuration, ease: ENTRANCE.ease })
        .to(row, {
          ...getCollapsedState(row),
          overflow: 'hidden',
          duration: ENTRANCE.fieldDuration,
          ease: ENTRANCE.ease,
        })
    },
    [prefersReducedMotion],
  )

  return { rowRef, exit }
}
