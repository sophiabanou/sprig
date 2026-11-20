import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { TYPEWRITER } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Types a text made of parts, an array of strings that should stay stable between renders.
  When the parts change, each part that differs from what is on screen is erased in place and retyped,
  from left to right, while matching parts stay put. Changing again mid way picks up from what is on screen.
  The text is written into the element directly so React does not rerender per letter.
  The first render and reduced motion show the text straight away. speed scales the time per letter.
*/
export function useTypewriter(parts = [], { delay = 0, speed = 1 } = {}) {
  const textRef = useRef(null)
  const shownRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const element = textRef.current
    if (!element) return undefined

    const render = () => {
      element.textContent = shownRef.current.join('')
    }
    /* What is on screen right now, one string per part, kept up to date while typing */
    const shown = shownRef.current
    const shouldType = shown && shown.length === parts.length && !prefersReducedMotion
    if (!shouldType) {
      shownRef.current = [...parts]
      render()
      return undefined
    }

    const from = [...shown]
    const timeline = gsap.timeline({ delay })
    parts.forEach((target, index) => {
      if (from[index] === target) return
      const erase = { count: from[index].length }
      const type = { count: 0 }

      timeline
        .to(erase, {
          count: 0,
          duration: from[index].length * TYPEWRITER.erase * speed,
          ease: 'none',
          onUpdate: () => {
            shown[index] = from[index].slice(0, Math.round(erase.count))
            render()
          },
        })
        .to(type, {
          count: target.length,
          duration: target.length * TYPEWRITER.type * speed,
          ease: 'none',
          onUpdate: () => {
            shown[index] = target.slice(0, Math.round(type.count))
            render()
          },
        })
    })

    return () => timeline.kill()
  }, [parts, delay, speed, prefersReducedMotion])

  return textRef
}
