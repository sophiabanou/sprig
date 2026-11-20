import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Bursts the pieces out from the center when isActive turns true, then lets them fall and fade. Never plays on mount, so a list that is already done stays calm. */
export function useConfettiBurst(isActive = false) {
  const confettiRef = useRef(null)
  const previousActiveRef = useRef(isActive)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const hasTurnedOn = isActive && !previousActiveRef.current
    previousActiveRef.current = isActive
    if (!hasTurnedOn || prefersReducedMotion || !confettiRef.current) return undefined

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-confetti]').forEach((piece) => {
        const angle = gsap.utils.random(-Math.PI, 0)
        const distance = gsap.utils.random(24, 56)

        gsap
          .timeline({ delay: gsap.utils.random(0, 0.08) })
          .set(piece, { x: 0, y: 0, rotation: 0, scale: gsap.utils.random(0.7, 1.2), opacity: 1 })
          .to(piece, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            rotation: gsap.utils.random(-240, 240),
            duration: 0.5,
            ease: 'power3.out',
          })
          .to(piece, { y: '+=28', rotation: '+=90', opacity: 0, duration: 0.7, ease: 'power1.in' })
      })
    }, confettiRef)

    return () => context.revert()
  }, [isActive, prefersReducedMotion])

  return confettiRef
}
