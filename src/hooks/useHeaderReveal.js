import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE, ENTRANCE_DELAY } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Title letters rise one after another, then the subtitle and the action rise in. Runs when the header mounts or its title changes. */
export function useHeaderReveal(text = '') {
  const headerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const header = headerRef.current
    if (prefersReducedMotion || !header) return undefined

    const context = gsap.context(() => {
      const timeline = gsap
        .timeline({ delay: ENTRANCE_DELAY.header, defaults: { ease: ENTRANCE.ease, duration: ENTRANCE.duration } })
        .from('[data-reveal="letter"]', { yPercent: 60, opacity: 0, stagger: ENTRANCE.letterStagger })
        .from('[data-reveal="subtitle"]', { y: ENTRANCE.rise, opacity: 0 }, 0.15)

      if (header.querySelector('[data-reveal="action"]')) {
        timeline.from('[data-reveal="action"]', { y: ENTRANCE.rise, opacity: 0 }, 0.15 + ENTRANCE.stagger)
      }
    }, headerRef)

    return () => context.revert()
  }, [text, prefersReducedMotion])

  return headerRef
}
