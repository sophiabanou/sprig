import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Fades an element in when it mounts and keeps it mounted while it fades out, then unmounts it.
  With a rise, it also pops up into place with a slight overshoot on the way in and slides back down on the way out.
  Elements already visible on the first render appear without motion. Visibility never changes,
  so the element can take focus the moment it mounts.
*/
export function useFadePresence(isVisible = true, { rise = 0 } = {}) {
  const elementRef = useRef(null)
  const hasRunRef = useRef(false)
  const [isRendered, setIsRendered] = useState(isVisible)
  const prefersReducedMotion = usePrefersReducedMotion()

  if (isVisible && !isRendered) setIsRendered(true)

  useLayoutEffect(() => {
    const isFirstRun = !hasRunRef.current
    hasRunRef.current = true
    const element = elementRef.current
    if (!element) return undefined

    if (prefersReducedMotion || (isFirstRun && isVisible)) {
      if (!isVisible) setIsRendered(false)
      return undefined
    }

    const tween = isVisible
      ? gsap.fromTo(
          element,
          { opacity: 0, y: rise },
          {
            opacity: 1,
            y: 0,
            duration: ENTRANCE.fieldDuration,
            ease: rise ? ENTRANCE.popEase : ENTRANCE.ease,
            clearProps: 'opacity,transform',
          },
        )
      : gsap.to(element, {
          opacity: 0,
          y: rise,
          duration: ENTRANCE.fieldDuration,
          ease: rise ? 'power2.in' : ENTRANCE.ease,
          onComplete: () => setIsRendered(false),
        })

    return () => tween.kill()
  }, [isVisible, rise, prefersReducedMotion])

  return { elementRef, isRendered, isLeaving: isRendered && !isVisible }
}
