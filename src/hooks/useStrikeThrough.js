import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const STRIKE = '--strike'

/*
  Sweeps a line through the text when isDone turns on and pulls it back when it turns off.
  The CSS reads --strike (0 to 1) for the line width and the fade to muted ink, and the done class
  sets the resting value. A toggle midway starts from where the line is, and the inline value is
  removed at the end so the class takes over again. The first render stays still.
*/
export function useStrikeThrough(isDone = false) {
  const textRef = useRef(null)
  const previousRef = useRef(isDone)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const element = textRef.current
    if (!element || previousRef.current === isDone) return undefined
    previousRef.current = isDone

    if (prefersReducedMotion) {
      element.style.removeProperty(STRIKE)
      return undefined
    }

    const current = parseFloat(element.style.getPropertyValue(STRIKE))
    const from = Number.isFinite(current) ? current : isDone ? 0 : 1
    const tween = gsap.fromTo(
      element,
      { [STRIKE]: from },
      {
        [STRIKE]: isDone ? 1 : 0,
        duration: 0.25 * Math.abs((isDone ? 1 : 0) - from),
        ease: 'power3.out',
        onComplete: () => element.style.removeProperty(STRIKE),
      },
    )
    return () => tween.kill()
  }, [isDone, prefersReducedMotion])

  return textRef
}
