import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Pops the element in with a small twist whenever value changes. The first render stays still. */
export function useChangePop(value) {
  const elementRef = useRef(null)
  const previousValueRef = useRef(value)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element || previousValueRef.current === value) return undefined
    previousValueRef.current = value
    if (prefersReducedMotion) return undefined

    const tween = gsap.fromTo(
      element,
      { scale: 0.4, rotate: -25, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.45, ease: ENTRANCE.popEase, clearProps: 'transform,opacity' },
    )
    return () => tween.kill()
  }, [value, prefersReducedMotion])

  return elementRef
}
