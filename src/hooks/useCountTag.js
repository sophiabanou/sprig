import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Pops the tag when its label changes, but not when it mounts. */
export function useCountTag(label = '') {
  const tagRef = useRef(null)
  const previousLabelRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const hasChanged = previousLabelRef.current !== null && previousLabelRef.current !== label
    previousLabelRef.current = label
    if (!hasChanged || prefersReducedMotion || !tagRef.current) return undefined

    const tween = gsap.fromTo(
      tagRef.current,
      { scale: 1.15 },
      { scale: 1, duration: ENTRANCE.duration, ease: ENTRANCE.popEase, clearProps: 'transform' },
    )
    return () => tween.kill()
  }, [label, prefersReducedMotion])

  return tagRef
}
