import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SWAP_DURATION } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Fades the empty state in when a list runs out of rows in place. The first render and a change of list
  (a new listKey, such as another tab) are left to the panel reveal.
*/
export function useEmptyEntrance(isEmpty = false, listKey = '') {
  const bodyRef = useRef(null)
  const previousRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const previous = previousRef.current
    previousRef.current = { isEmpty, listKey }
    const body = bodyRef.current
    const hasEmptied = previous && previous.listKey === listKey && !previous.isEmpty && isEmpty
    if (!hasEmptied || prefersReducedMotion || !body) return undefined

    const tween = gsap.from(body, {
      opacity: 0,
      duration: SWAP_DURATION,
      ease: 'power1.out',
      clearProps: 'opacity',
    })
    return () => tween.progress(1).kill()
  }, [isEmpty, listKey, prefersReducedMotion])

  return bodyRef
}
