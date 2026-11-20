import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getDrawerOffscreen } from '../utils/drawer'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const DRAG_THRESHOLD = 8
const DISMISS_RATIO = 0.3
const DISMISS_VELOCITY = 0.5

/*
  Swipe down to dismiss the bottom sheet. Only runs when the panel slides in from below,
  and only takes over when the content is scrolled to the top, so scrolling the form still works.
  A long drag or a quick flick dismisses; anything else springs back.
*/
export function useSheetSwipe({ panelRef, scrimRef, onDismiss } = {}) {
  const onDismissRef = useRef(onDismiss)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    const panel = panelRef?.current
    const scrim = scrimRef?.current
    if (!panel || !scrim) return undefined

    const gesture = { startY: 0, startTime: 0, distance: 0, isTracking: false, isDragging: false }

    function handleTouchStart(event) {
      const isSheet = getDrawerOffscreen(panel).yPercent > 0
      gesture.isTracking = isSheet && event.touches.length === 1 && panel.scrollTop <= 0
      gesture.isDragging = false
      gesture.distance = 0
      gesture.startY = event.touches[0].clientY
      gesture.startTime = event.timeStamp
    }

    function handleTouchMove(event) {
      if (!gesture.isTracking) return
      const distance = event.touches[0].clientY - gesture.startY

      if (!gesture.isDragging) {
        if (distance < -DRAG_THRESHOLD) gesture.isTracking = false
        if (distance < DRAG_THRESHOLD) return
        gesture.isDragging = true
        gsap.killTweensOf([panel, scrim])
      }

      event.preventDefault()
      gesture.distance = Math.max(0, distance - DRAG_THRESHOLD)
      gsap.set(panel, { y: gesture.distance })
      gsap.set(scrim, { opacity: 1 - gesture.distance / panel.offsetHeight })
    }

    function handleTouchEnd(event) {
      if (!gesture.isDragging) return
      gesture.isDragging = false
      gesture.isTracking = false

      const velocity = gesture.distance / Math.max(1, event.timeStamp - gesture.startTime)
      if (gesture.distance > panel.offsetHeight * DISMISS_RATIO || velocity > DISMISS_VELOCITY) {
        onDismissRef.current?.()
        return
      }

      const duration = prefersReducedMotion ? 0 : 0.45
      gsap.to(panel, { y: 0, duration, ease: 'back.out(1.4)' })
      gsap.to(scrim, { opacity: 1, duration, ease: 'power2.out' })
    }

    panel.addEventListener('touchstart', handleTouchStart, { passive: true })
    panel.addEventListener('touchmove', handleTouchMove, { passive: false })
    panel.addEventListener('touchend', handleTouchEnd)
    panel.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart)
      panel.removeEventListener('touchmove', handleTouchMove)
      panel.removeEventListener('touchend', handleTouchEnd)
      panel.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [panelRef, scrimRef, prefersReducedMotion])
}
