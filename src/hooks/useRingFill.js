import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const FILL = '[data-ring-fill]'

/*
  Draws each ring fill to the dash offset in its data-offset attribute (0 drawn, 1 empty).
  Segments that change draw one after another in the direction of the change. The first run is instant.
  The offset only runs from 0 to 1, so autoRound stays off or GSAP would snap it to whole pixels.
*/
export function useRingFill(count = 0) {
  const ringRef = useRef(null)
  const previousCountRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const ring = ringRef.current
    if (!ring) return undefined

    const fills = gsap.utils.toArray(ring.querySelectorAll(FILL))
    const isFirstRun = previousCountRef.current === null
    const isGrowing = count >= (previousCountRef.current ?? 0)
    previousCountRef.current = count
    const toOffset = (_, element) => Number(element.dataset.offset)

    if (isFirstRun || prefersReducedMotion) {
      gsap.set(fills, { strokeDashoffset: toOffset })
      return undefined
    }

    const changed = fills.filter(
      (element) => Math.abs(parseFloat(gsap.getProperty(element, 'strokeDashoffset')) - toOffset(0, element)) > 0.001,
    )
    if (changed.length === 0) return undefined

    const tween = gsap.to(isGrowing ? changed : changed.reverse(), {
      strokeDashoffset: toOffset,
      autoRound: false,
      duration: 0.4,
      ease: 'power2.inOut',
      stagger: 0.08,
    })
    return () => tween.progress(1).kill()
  }, [count, prefersReducedMotion])

  return ringRef
}
