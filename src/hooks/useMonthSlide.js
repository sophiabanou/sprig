import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const SLIDE_DURATION = 0.28

/* Slides the month in from the side it came from: later months from the right, earlier from the left. */
export function useMonthSlide(monthKey = '') {
  const elementRef = useRef(null)
  const previousMonthRef = useRef(monthKey)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const element = elementRef.current
    const previousMonth = previousMonthRef.current
    previousMonthRef.current = monthKey
    if (!element || previousMonth === monthKey || prefersReducedMotion) return undefined

    const direction = monthKey > previousMonth ? 1 : -1
    const tween = gsap.fromTo(
      element,
      { x: direction * ENTRANCE.rise, opacity: 0 },
      { x: 0, opacity: 1, duration: SLIDE_DURATION, ease: ENTRANCE.ease, clearProps: 'transform,opacity' },
    )
    return () => tween.kill()
  }, [monthKey, prefersReducedMotion])

  return elementRef
}
