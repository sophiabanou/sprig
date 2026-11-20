import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/*
  The button stays put so its hover area never moves. Only its face slides up and left
  while the ink shadow behind it fades in, both as transform and opacity so the motion stays smooth.
  Pressing flattens it, releasing lifts it again while still hovered. Touch is ignored so a tap
  does not leave the button stuck in the air.
*/
export function useLiftHover(isDisabled = false) {
  const buttonRef = useRef(null)
  const faceRef = useRef(null)
  const shadowRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const button = buttonRef.current
    const face = faceRef.current
    const shadow = shadowRef.current
    if (!button || !face || !shadow) return undefined

    const distance = parseFloat(getComputedStyle(button).getPropertyValue('--size-lift')) || 0
    const scale = prefersReducedMotion ? 0 : 1

    const setLift = (isLifted, duration) => {
      const vars = { duration: duration * scale, ease: 'power3.out', overwrite: true }
      gsap.to(face, { ...vars, x: isLifted ? -distance : 0, y: isLifted ? -distance : 0 })
      gsap.to(shadow, { ...vars, opacity: isLifted ? 1 : 0 })
    }

    if (isDisabled) {
      setLift(false, 0.2)
      return undefined
    }

    const isMouse = (event) => event.pointerType !== 'touch'
    const handlePointerEnter = (event) => isMouse(event) && setLift(true, 0.3)
    const handlePointerLeave = (event) => isMouse(event) && setLift(false, 0.25)
    const handlePointerDown = (event) => isMouse(event) && setLift(false, 0.1)
    const handlePointerUp = (event) => isMouse(event) && button.matches(':hover') && setLift(true, 0.3)

    button.addEventListener('pointerenter', handlePointerEnter)
    button.addEventListener('pointerleave', handlePointerLeave)
    button.addEventListener('pointerdown', handlePointerDown)
    button.addEventListener('pointerup', handlePointerUp)
    button.addEventListener('pointercancel', handlePointerLeave)
    if (button.matches(':hover')) setLift(true, 0.3)

    return () => {
      button.removeEventListener('pointerenter', handlePointerEnter)
      button.removeEventListener('pointerleave', handlePointerLeave)
      button.removeEventListener('pointerdown', handlePointerDown)
      button.removeEventListener('pointerup', handlePointerUp)
      button.removeEventListener('pointercancel', handlePointerLeave)
      gsap.killTweensOf([face, shadow])
    }
  }, [isDisabled, prefersReducedMotion])

  return { buttonRef, faceRef, shadowRef }
}
