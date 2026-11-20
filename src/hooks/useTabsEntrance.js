import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE, ENTRANCE_DELAY } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Plays once on mount, just after the page header: the bar rises in, the labels follow one by one and the pill pops into place. */
export function useTabsEntrance() {
  const rootRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (prefersReducedMotion || !rootRef.current) return undefined

    const context = gsap.context(() => {
      gsap
        .timeline({ delay: ENTRANCE_DELAY.tabs, defaults: { ease: ENTRANCE.ease, duration: ENTRANCE.duration } })
        .from('[role="tablist"]', { y: ENTRANCE.rise, opacity: 0 })
        .from('[role="tab"]', { y: ENTRANCE.rise / 2, opacity: 0, stagger: ENTRANCE.stagger }, 0.1)
        .from('[data-pill-indicator]', { scale: 0.5, opacity: 0, ease: ENTRANCE.popEase }, 0.2)
    }, rootRef)

    return () => context.revert()
  }, [prefersReducedMotion])

  return rootRef
}
