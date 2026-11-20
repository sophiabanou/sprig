import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE, ENTRANCE_DELAY } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const HEADING = '[data-reveal="list-heading"]'
const BODY = '[data-reveal="list-body"]'

/*
  Reveals the panel when the page renders, just after the header and tabs, and again whenever its content changes.
  A list card plays in two parts: the heading slides in from the side while its illustration pops in,
  then each row rises on its own, one after another. A list with no rows, and anything else, rises as a whole.
*/
export function usePanelReveal(key = '') {
  const panelRef = useRef(null)
  const previousKeyRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const isMount = previousKeyRef.current === null || previousKeyRef.current === key
    previousKeyRef.current = key
    const panel = panelRef.current
    if (prefersReducedMotion || !panel) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        delay: isMount ? ENTRANCE_DELAY.panel : 0,
        defaults: { ease: ENTRANCE.ease, duration: ENTRANCE.duration, clearProps: 'transform,opacity' },
      })

      if (!panel.querySelector(HEADING)) {
        timeline.from(panel, { y: ENTRANCE.rise, opacity: 0 })
        return
      }

      timeline.from(`${HEADING} > :not(svg)`, { x: -ENTRANCE.rise, opacity: 0, stagger: ENTRANCE.stagger }, 0)

      if (panel.querySelector(`${HEADING} > svg`)) {
        timeline.from(
          `${HEADING} > svg`,
          { scale: 0.5, rotation: -12, opacity: 0, transformOrigin: '50% 50%', ease: ENTRANCE.popEase },
          0,
        )
      }

      if (panel.querySelector(`${BODY} li`)) {
        timeline.from(`${BODY} li`, { y: ENTRANCE.rise, opacity: 0, stagger: ENTRANCE.stagger }, ENTRANCE.stagger * 2)
      } else {
        timeline.from(BODY, { y: ENTRANCE.rise, opacity: 0 }, ENTRANCE.stagger * 2)
      }
    }, panelRef)

    return () => context.revert()
  }, [key, prefersReducedMotion])

  return panelRef
}
