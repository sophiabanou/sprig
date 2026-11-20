import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SKY_SCENE } from '../assets/icons/skyScene'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const PEEK_DISTANCE = 4

const part = (name = '') => `[data-sky="${name}"]`

/*
  Plays the sky switch between day and night. The sky color and the orb color follow --night, a number from 0 to 1
  that the CSS mixes into the scene tokens. Going to night, the clouds sink away, the rays fold into the sun as it rolls
  right, a bite slides over it to carve the moon and the stars pop in, then twinkle. Going to day plays it in reverse.
  It shares the button ref with useLiftHover. On hover the orb peeks toward the other side. The first run and reduced motion jump straight to the end.
*/
export function useSkySwitch(switchRef = null, isNight = false) {
  const isFirstRunRef = useRef(true)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const button = switchRef.current
    if (!button) return undefined

    const scale = isFirstRunRef.current || prefersReducedMotion ? 0 : 1
    isFirstRunRef.current = false
    let twinkle = null

    const context = gsap.context(() => {
      const bite = isNight ? SKY_SCENE.bite.night : SKY_SCENE.bite.day
      const timeline = gsap.timeline({ defaults: { duration: 0.6 * scale, ease: 'power3.inOut', overwrite: 'auto' } })

      timeline
        .to(button, { '--night': isNight ? 1 : 0 }, 0)
        .to(part('peek'), { x: 0, duration: 0.3 * scale }, 0)
        .to(part('orb'), { x: isNight ? SKY_SCENE.travel : 0, ease: isNight ? 'back.out(1.2)' : 'power3.inOut', duration: 0.75 * scale }, 0)
        .to(
          part('rays'),
          { scale: isNight ? 0 : 1, rotation: isNight ? -90 : 0, opacity: isNight ? 0 : 1, transformOrigin: '50% 50%' },
          isNight ? 0 : 0.3 * scale,
        )
        .to(part('bite'), { attr: bite, duration: 0.5 * scale }, isNight ? 0.3 * scale : 0)
        .to(
          `${part('clouds')} path`,
          { y: isNight ? 14 : 0, opacity: isNight ? 0 : 1, stagger: 0.08 * scale, ease: isNight ? 'power2.in' : 'back.out(1.6)' },
          isNight ? 0 : 0.35 * scale,
        )
        .to(
          `${part('stars')} path`,
          {
            scale: isNight ? 1 : 0,
            opacity: isNight ? 1 : 0,
            transformOrigin: '50% 50%',
            duration: 0.4 * scale,
            stagger: 0.06 * scale,
            ease: isNight ? 'back.out(3)' : 'power2.in',
          },
          isNight ? 0.45 * scale : 0,
        )

      if (isNight && !prefersReducedMotion) {
        timeline.eventCallback('onComplete', () => {
          twinkle = gsap.to(`${part('stars')} path`, {
            opacity: 0.35,
            duration: 1.1,
            ease: 'sine.inOut',
            stagger: { each: 0.5, repeat: -1, yoyo: true },
          })
        })
      }

      if (scale === 0) timeline.progress(1)
    }, switchRef)

    return () => {
      twinkle?.kill()
      context.kill()
    }
  }, [switchRef, isNight, prefersReducedMotion])

  useEffect(() => {
    const button = switchRef.current
    if (!button || prefersReducedMotion) return undefined
    const peek = button.querySelector(part('peek'))

    const isMouse = (event) => event.pointerType !== 'touch'
    const setPeek = (isPeeking) => {
      const direction = button.getAttribute('aria-checked') === 'true' ? -1 : 1
      gsap.to(peek, { x: isPeeking ? PEEK_DISTANCE * direction : 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
    }
    const handlePointerEnter = (event) => isMouse(event) && setPeek(true)
    const handlePointerLeave = (event) => isMouse(event) && setPeek(false)

    button.addEventListener('pointerenter', handlePointerEnter)
    button.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      button.removeEventListener('pointerenter', handlePointerEnter)
      button.removeEventListener('pointerleave', handlePointerLeave)
      gsap.killTweensOf(peek)
    }
  }, [switchRef, prefersReducedMotion])
}
