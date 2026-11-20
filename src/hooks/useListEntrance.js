import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { COLLAPSE_PROPS, getCollapsedState } from '../utils/collapse'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Opens space for the rows whose keys were not in the list before, then fades them in moving to the right. The first render and a change of list
  (a new listKey, such as another tab) are left to the panel reveal, so only rows added in place animate.
*/
export function useListEntrance(keys = [], listKey = '') {
  const listRef = useRef(null)
  const previousRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const signature = keys.join('|')

  useLayoutEffect(() => {
    const previous = previousRef.current
    const currentKeys = signature ? signature.split('|') : []
    previousRef.current = { listKey, keys: new Set(currentKeys) }
    const list = listRef.current
    if (!previous || previous.listKey !== listKey || prefersReducedMotion || !list) return undefined

    const added = currentKeys
      .map((key, index) => (previous.keys.has(key) ? null : list.children[index]))
      .filter(Boolean)
    if (added.length === 0) return undefined

    const timelines = added.map((row) =>
      gsap
        .timeline({ defaults: { ease: ENTRANCE.ease, duration: ENTRANCE.fieldDuration } })
        .set(row, { opacity: 0 })
        .from(row, { ...getCollapsedState(row), overflow: 'hidden', clearProps: COLLAPSE_PROPS })
        .fromTo(
          row,
          { x: -ENTRANCE.rise, opacity: 0 },
          { x: 0, opacity: 1, duration: ENTRANCE.duration, clearProps: 'transform,opacity' },
          ENTRANCE.fieldDuration / 2,
        ),
    )
    return () => timelines.forEach((timeline) => timeline.progress(1).kill())
  }, [signature, listKey, prefersReducedMotion])

  return listRef
}
