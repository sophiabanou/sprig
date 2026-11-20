import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const FILL = '[data-check-fill]'
const MARK = '[data-check-mark] path'

/*
  Checking pops the fill in with a twist and then draws the tick. Unchecking erases the tick and
  shrinks the fill away. The CSS holds the resting state, so every tween clears its props when done.
  The first render stays still.
*/
export function useCheckPop(isChecked = false) {
  const boxRef = useRef(null)
  const previousRef = useRef(isChecked)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box || previousRef.current === isChecked) return undefined
    previousRef.current = isChecked
    if (prefersReducedMotion) return undefined

    const fill = box.querySelector(FILL)
    const mark = box.querySelector(MARK)
    const length = mark.getTotalLength()
    const timeline = gsap.timeline({
      onComplete: () => gsap.set([fill, mark.parentNode, mark], { clearProps: 'all' }),
    })

    if (isChecked) {
      timeline
        .fromTo(fill, { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.4, ease: ENTRANCE.popEase })
        .fromTo(
          mark,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' },
          0.12,
        )
    } else {
      timeline
        .set([fill, mark.parentNode], { opacity: 1 })
        .fromTo(
          mark,
          { strokeDasharray: length, strokeDashoffset: 0 },
          { strokeDashoffset: -length, duration: 0.12, ease: 'power2.in' },
        )
        .fromTo(fill, { scale: 1 }, { scale: 0, duration: 0.18, ease: 'power2.in' }, 0.06)
    }

    return () => timeline.progress(1).kill()
  }, [isChecked, prefersReducedMotion])

  return boxRef
}
