import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE, ENTRANCE_DELAY } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const HEADING = '[data-reveal="list-heading"]'
const BODY = '[data-reveal="list-body"]'
/* Only the rows of a list, not list items nested deeper, such as the lines of a note */
const ROWS = `${BODY} > ul > li`

/*
  Reveals the panel when the page renders, just after the header and tabs, and again whenever its content changes.
  A list card plays in two parts: the heading slides in from the side while its illustration pops in,
  then each row rises on its own, one after another. A list with no rows, and anything else, rises as a whole.
  With hasSharedHeading, a change of key keeps the heading still, for panels whose states share one heading.
*/
export function usePanelReveal(key = '', { hasSharedHeading = false } = {}) {
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

      const isHeadingStill = hasSharedHeading && !isMount
      if (!isHeadingStill) {
        timeline.from(`${HEADING} > :not(svg)`, { x: -ENTRANCE.rise, opacity: 0, stagger: ENTRANCE.stagger }, 0)
      }

      if (!isHeadingStill && panel.querySelector(`${HEADING} > svg`)) {
        timeline.from(
          `${HEADING} > svg`,
          { scale: 0.5, rotation: -12, opacity: 0, transformOrigin: '50% 50%', ease: ENTRANCE.popEase },
          0,
        )
      }

      if (panel.querySelector(ROWS)) {
        timeline.from(ROWS, { y: ENTRANCE.rise, opacity: 0, stagger: ENTRANCE.stagger }, isHeadingStill ? 0 : ENTRANCE.stagger * 2)
      } else {
        timeline.from(BODY, { y: ENTRANCE.rise, opacity: 0 }, isHeadingStill ? 0 : ENTRANCE.stagger * 2)
      }
    }, panelRef)

    return () => context.revert()
  }, [key, hasSharedHeading, prefersReducedMotion])

  return panelRef
}
