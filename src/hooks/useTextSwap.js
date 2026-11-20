import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Swaps two stacked texts. Turning on, the off text rises out while the on text rises in from below.
  Turning off plays the same motion downward. The first run is instant.
*/
export function useTextSwap(isOn = false) {
  const offRef = useRef(null)
  const onRef = useRef(null)
  const hasRunRef = useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const isFirstRun = !hasRunRef.current
    hasRunRef.current = true
    const incoming = isOn ? onRef.current : offRef.current
    const outgoing = isOn ? offRef.current : onRef.current
    if (!incoming || !outgoing) return undefined

    if (isFirstRun || prefersReducedMotion) {
      gsap.set(outgoing, { y: 0, autoAlpha: 0 })
      gsap.set(incoming, { y: 0, autoAlpha: 1 })
      return undefined
    }

    const distance = isOn ? ENTRANCE.fieldRise : -ENTRANCE.fieldRise
    const timeline = gsap
      .timeline({ defaults: { duration: ENTRANCE.fieldDuration, ease: ENTRANCE.ease, overwrite: true } })
      .to(outgoing, { y: -distance, autoAlpha: 0 })
      .fromTo(incoming, { y: distance, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, ENTRANCE.fieldDuration / 3)

    return () => timeline.progress(1).kill()
  }, [isOn, prefersReducedMotion])

  return { offRef, onRef }
}
