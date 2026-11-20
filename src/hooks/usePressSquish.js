import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ENTRANCE } from '../utils/motion'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const PRESSED_SCALE = 0.86
const PRESS_KEYS = [' ', 'Enter']

/* Squishes the target while the button is held, by pointer or key, and bounces it back on release */
export function usePressSquish(isDisabled = false) {
  const buttonRef = useRef(null)
  const targetRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const button = buttonRef.current
    const target = targetRef.current
    if (!button || !target || isDisabled || prefersReducedMotion) return undefined

    const press = () => gsap.to(target, { scale: PRESSED_SCALE, duration: 0.12, ease: 'power2.out', overwrite: true })
    const release = () =>
      gsap.to(target, { scale: 1, duration: 0.5, ease: ENTRANCE.popEase, overwrite: true, clearProps: 'transform' })
    const handleKeyDown = (event) => PRESS_KEYS.includes(event.key) && !event.repeat && press()
    const handleKeyUp = (event) => PRESS_KEYS.includes(event.key) && release()

    button.addEventListener('pointerdown', press)
    button.addEventListener('pointerup', release)
    button.addEventListener('pointerleave', release)
    button.addEventListener('pointercancel', release)
    button.addEventListener('keydown', handleKeyDown)
    button.addEventListener('keyup', handleKeyUp)

    return () => {
      button.removeEventListener('pointerdown', press)
      button.removeEventListener('pointerup', release)
      button.removeEventListener('pointerleave', release)
      button.removeEventListener('pointercancel', release)
      button.removeEventListener('keydown', handleKeyDown)
      button.removeEventListener('keyup', handleKeyUp)
      gsap.killTweensOf(target)
      gsap.set(target, { clearProps: 'transform' })
    }
  }, [isDisabled, prefersReducedMotion])

  return { buttonRef, targetRef }
}
