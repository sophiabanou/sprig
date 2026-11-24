import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VIEW_SWAP } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const RISE = () => ({ x: 0, y: VIEW_SWAP.rise })

/*
  Plays one view out and the next one in when viewKey changes. Render from the returned shownKey, which holds
  the old view while it leaves and moves to the new one once it is gone. getOffset(fromKey, toKey) gives the
  { x, y } the new view comes in from; the old view leaves the opposite way. The first render and a disabled
  swap change views at once, without motion.
*/
export function useViewSwap(viewKey = '', { getOffset = RISE, isEnabled = true } = {}) {
  const elementRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const [shownKey, setShownKey] = useState(viewKey)
  const [enterCount, setEnterCount] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isLeaving = shownKey !== viewKey
  const shouldAnimate = isEnabled && !prefersReducedMotion

  if (isLeaving && !shouldAnimate) setShownKey(viewKey)

  /* A swap cut short by turning motion off must not leave the view faded out */
  useLayoutEffect(() => {
    if (!shouldAnimate && elementRef.current) gsap.set(elementRef.current, { clearProps: 'opacity,transform' })
  }, [shouldAnimate, shownKey])

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!isLeaving || !shouldAnimate) return undefined
    if (!element) {
      setShownKey(viewKey)
      return undefined
    }

    const offset = getOffset(shownKey, viewKey)
    offsetRef.current = offset
    const tween = gsap.to(element, {
      opacity: 0,
      x: -offset.x,
      y: -offset.y / 2,
      duration: VIEW_SWAP.exit,
      ease: VIEW_SWAP.exitEase,
      onComplete: () => {
        setShownKey(viewKey)
        setEnterCount((count) => count + 1)
      },
    })
    return () => tween.kill()
  }, [isLeaving, shouldAnimate, shownKey, viewKey, getOffset])

  useLayoutEffect(() => {
    const element = elementRef.current
    if (enterCount === 0 || !element) return undefined

    const tween = gsap.fromTo(
      element,
      { opacity: 0, ...offsetRef.current },
      { opacity: 1, x: 0, y: 0, duration: VIEW_SWAP.enter, ease: 'power3.out', clearProps: 'opacity,transform' },
    )
    return () => tween.progress(1).kill()
  }, [enterCount])

  return { elementRef, shownKey, isLeaving }
}
