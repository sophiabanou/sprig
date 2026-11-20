import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const getBoxKey = (box) => (box ? `${box.left} ${box.right} ${box.top} ${box.bottom}` : '')

/* Moves a pastel indicator behind the active item of a list, horizontally or vertically. On change the leading
   edge moves first and the trailing edge catches up, so the pill stretches and settles in one motion, while the
   item inks cross fade. It only animates when the active item changes, and jumps into place on mount and on resize.
   Vertical moves glide with a lighter stretch and no squish, since the pills there are wide.
   An optional child marked data-indicator-fade, holding the previous tone, fades out so the fill cross fades.
   When no item matches activeSelector the indicator hides, and it appears in place again without gliding.
   Item positions are read with offsetLeft and offsetTop, so the list element must be positioned. */
export function useSlidingIndicator(activeId = '', { itemSelector = '', activeSelector = '' } = {}) {
  const listRef = useRef(null)
  const indicatorRef = useRef(null)
  const timelineRef = useRef(null)
  const previousItemRef = useRef(null)
  const previousIdRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return undefined

    const items = list.querySelectorAll(itemSelector)
    const activeItem = list.querySelector(activeSelector)
    const fade = indicator.querySelector('[data-indicator-fade]')

    const getTarget = () =>
      activeItem
        ? {
            left: activeItem.offsetLeft,
            right: activeItem.offsetLeft + activeItem.offsetWidth,
            top: activeItem.offsetTop,
            bottom: activeItem.offsetTop + activeItem.offsetHeight,
          }
        : null

    const applyBox = (box) =>
      gsap.set(indicator, { x: box.left, y: box.top, width: box.right - box.left, height: box.bottom - box.top })

    const snap = () => {
      const target = getTarget()
      timelineRef.current?.progress(1).kill()
      gsap.set(indicator, { autoAlpha: target ? 1 : 0 })
      if (!target) return
      applyBox(target)
      gsap.set(indicator, { scale: 1 })
      if (fade) gsap.set(fade, { opacity: 0 })
    }

    const glide = () => {
      const target = getTarget()
      if (!target) return
      timelineRef.current?.kill()
      /* CSS hover transitions are paused so they do not fight the GSAP color fade */
      gsap.set(items, { clearProps: 'color', transition: 'none' })
      const previousItem = previousItemRef.current
      const itemInk = (item) => getComputedStyle(item).getPropertyValue('--tone-fg')
      const restingInk = previousItem ? getComputedStyle(previousItem).color : ''

      const x = Number(gsap.getProperty(indicator, 'x'))
      const y = Number(gsap.getProperty(indicator, 'y'))
      const box = {
        left: x,
        right: x + Number(gsap.getProperty(indicator, 'width')),
        top: y,
        bottom: y + Number(gsap.getProperty(indicator, 'height')),
      }
      const isVertical = Math.abs(target.top - box.top) > Math.abs(target.left - box.left)
      const [start, end, crossStart, crossEnd] = isVertical
        ? ['top', 'bottom', 'left', 'right']
        : ['left', 'right', 'top', 'bottom']
      const isMovingForward = target[start] > box[start]
      const leadEdge = isMovingForward ? end : start
      const trailEdge = isMovingForward ? start : end
      const update = () => applyBox(box)

      timelineRef.current = gsap.timeline()
      if (isVertical) {
        timelineRef.current
          .to(box, { [leadEdge]: target[leadEdge], duration: 0.4, ease: 'power3.out', onUpdate: update }, 0)
          .to(box, { [trailEdge]: target[trailEdge], duration: 0.4, ease: 'power3.out', onUpdate: update }, 0.04)
      } else {
        timelineRef.current
          .to(box, { [leadEdge]: target[leadEdge], duration: 0.35, ease: 'power3.out', onUpdate: update }, 0)
          .to(box, { [trailEdge]: target[trailEdge], duration: 0.4, ease: 'power3.inOut', onUpdate: update }, 0.08)
          .to(indicator, { scaleY: 0.92, duration: 0.18, ease: 'sine.out' }, 0)
          .to(indicator, { scaleY: 1, duration: 0.3, ease: 'sine.inOut' }, 0.18)
      }
      timelineRef.current.to(
        box,
        { [crossStart]: target[crossStart], [crossEnd]: target[crossEnd], duration: 0.4, ease: 'power3.inOut', onUpdate: update },
        0,
      )
      if (fade) timelineRef.current.fromTo(fade, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0)

      if (!previousItem || previousItem === activeItem) {
        gsap.set(items, { clearProps: 'transition' })
        return
      }
      gsap.set([...items].filter((item) => item !== activeItem && item !== previousItem), { clearProps: 'transition' })
      timelineRef.current
        .from(activeItem, { color: restingInk, duration: 0.35, ease: 'power2.out', clearProps: 'color,transition' }, 0.12)
        .from(previousItem, { color: itemInk(previousItem), duration: 0.25, ease: 'power2.out', clearProps: 'color,transition' }, 0)
    }

    const hasChanged = previousIdRef.current !== null && previousIdRef.current !== activeId
    const isBetweenItems = Boolean(previousItemRef.current && activeItem)
    if (hasChanged && isBetweenItems && !prefersReducedMotion) glide()
    else snap()
    previousIdRef.current = activeId
    previousItemRef.current = activeItem

    /* Snaps only when the layout really moved. A list measured while hidden (a form mounting inside a closed
       dialog) reads zero sizes, so the first callback after it shows must still place the indicator. */
    let measuredKey = getBoxKey(getTarget())
    const observer = new ResizeObserver(() => {
      const key = getBoxKey(getTarget())
      if (key === measuredKey) return
      measuredKey = key
      snap()
    })
    observer.observe(list)
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [activeId, prefersReducedMotion, itemSelector, activeSelector])

  return { listRef, indicatorRef }
}
