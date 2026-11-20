import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  Drives a native popover opened by a popovertarget button, which already handles light dismiss, Esc
  and returning focus. The panel sits in the top layer, so it is placed by hand under the anchor,
  flipping above when there is no room below and staying inside the viewport. While open it follows
  the anchor through scrolling and resizing. On open focus moves to the element marked data-popover-focus.
*/
export function usePopover() {
  const anchorRef = useRef(null)
  const panelRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const place = useCallback(() => {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return
    const box = anchor.getBoundingClientRect()
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue('--space-2')) || 0
    const height = panel.offsetHeight
    const width = panel.offsetWidth
    const isAbove = box.bottom + gap + height > window.innerHeight && box.top - gap - height > 0
    panel.style.top = `${isAbove ? box.top - gap - height : box.bottom + gap}px`
    panel.style.left = `${Math.min(Math.max(box.left, gap), window.innerWidth - width - gap)}px`
    panel.dataset.placement = isAbove ? 'above' : 'below'
  }, [])

  const close = useCallback(() => panelRef.current?.hidePopover(), [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined

    const handleBeforeToggle = (event) => {
      if (event.newState === 'open') gsap.set(panel, { opacity: 0 })
    }

    const handleToggle = (event) => {
      const isOpening = event.newState === 'open'
      setIsOpen(isOpening)
      if (!isOpening) return
      place()
      panel.querySelector('[data-popover-focus]')?.focus()
      const isAbove = panel.dataset.placement === 'above'
      gsap.fromTo(
        panel,
        { opacity: 0, y: isAbove ? 6 : -6, scale: 0.97, transformOrigin: isAbove ? 'bottom left' : 'top left' },
        { opacity: 1, y: 0, scale: 1, duration: prefersReducedMotion ? 0 : 0.22, ease: 'power3.out', overwrite: true },
      )
    }

    panel.addEventListener('beforetoggle', handleBeforeToggle)
    panel.addEventListener('toggle', handleToggle)
    return () => {
      panel.removeEventListener('beforetoggle', handleBeforeToggle)
      panel.removeEventListener('toggle', handleToggle)
      gsap.killTweensOf(panel)
    }
  }, [place, prefersReducedMotion])

  useEffect(() => {
    if (!isOpen) return undefined
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [isOpen, place])

  return { anchorRef, panelRef, isOpen, close }
}
