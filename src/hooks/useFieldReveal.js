import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Shows and hides a piece of a form with motion. On the way in the space opens first, pulling back the
  parent's gap so the rows below glide instead of jumping, then the content fades in. On the way out the
  content fades first, then the space closes and the piece unmounts. Nothing is clipped, so borders and
  the focus ring stay whole. Pieces already visible on the first render appear without motion.
*/
export function useFieldReveal(isVisible = true) {
  const revealRef = useRef(null)
  const hasRunRef = useRef(false)
  const [isRendered, setIsRendered] = useState(isVisible)
  const prefersReducedMotion = usePrefersReducedMotion()

  if (isVisible && !isRendered) setIsRendered(true)

  useLayoutEffect(() => {
    const isFirstRun = !hasRunRef.current
    hasRunRef.current = true
    const element = revealRef.current
    if (!element) return undefined

    if (prefersReducedMotion || (isFirstRun && isVisible)) {
      if (!isVisible) setIsRendered(false)
      return undefined
    }

    const parent = element.parentElement
    const gap = parent ? parseFloat(getComputedStyle(parent).rowGap) || 0 : 0
    const space = { height: 0, marginTop: -gap }
    const content = { y: -ENTRANCE.fieldRise, opacity: 0 }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: ENTRANCE.ease, duration: ENTRANCE.fieldDuration } })

      if (isVisible) {
        timeline
          .from(element, { ...space, clearProps: 'height,marginTop' })
          .from(element.children, { ...content, clearProps: 'transform,opacity' }, ENTRANCE.fieldDuration / 2)
        return
      }

      timeline
        .to(element.children, content)
        .to(element, space, ENTRANCE.fieldDuration / 2)
        .eventCallback('onComplete', () => setIsRendered(false))
    }, revealRef)

    return () => context.revert()
  }, [isVisible, prefersReducedMotion])

  return { revealRef, isRendered, isLeaving: isRendered && !isVisible }
}
