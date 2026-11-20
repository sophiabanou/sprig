import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { getDrawerOffscreen } from '../utils/drawer'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const ONSCREEN = { x: 0, y: 0, xPercent: 0, yPercent: 0 }

/*
  Opening: the scrim fades in while the panel glides in.
  Closing plays a quicker reverse and only then closes the dialog, so focus returns after the panel leaves.
  Both start from wherever the panel is, so a close during a swipe or mid entrance stays smooth.
*/
export function useDrawerTransition(isOpen = false) {
  const dialogRef = useRef(null)
  const scrimRef = useRef(null)
  const panelRef = useRef(null)
  const timelineRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const scrim = scrimRef.current
    const panel = panelRef.current
    if (!dialog || !scrim || !panel) return

    const offscreen = getDrawerOffscreen(panel)
    timelineRef.current?.kill()
    gsap.killTweensOf([scrim, panel])

    if (isOpen) {
      if (dialog.open) return
      dialog.showModal()
      panel.querySelector('[data-autofocus]')?.focus({ preventScroll: true })

      if (prefersReducedMotion) {
        gsap.set(scrim, { opacity: 1 })
        gsap.set(panel, ONSCREEN)
        return
      }

      timelineRef.current = gsap
        .timeline()
        .fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
        .fromTo(panel, { ...offscreen, x: 0, y: 0 }, { ...ONSCREEN, duration: 0.6, ease: 'expo.out' }, 0)
      return
    }

    if (!dialog.open) return
    const duration = prefersReducedMotion ? 0 : 0.3
    timelineRef.current = gsap
      .timeline({ onComplete: () => dialog.close() })
      .to(scrim, { opacity: 0, duration, ease: 'power2.in' }, 0)
      .to(panel, { ...offscreen, duration, ease: 'power3.in' }, 0)
  }, [isOpen, prefersReducedMotion])

  useLayoutEffect(() => () => timelineRef.current?.kill(), [])

  return { dialogRef, scrimRef, panelRef }
}
