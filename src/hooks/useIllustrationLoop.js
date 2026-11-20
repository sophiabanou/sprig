import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const ILLUSTRATION_CENTER = '24 24'
const ILLUSTRATION_BASE = '24 40'

const select = (motion = '') => `[data-motion~="${motion}"]`

/* Spin turns the paths, not the group, so the group stays free for shake. */
const MOTION_LOOPS = {
  spin: () =>
    gsap.to(`${select('spin')} path`, {
      rotation: 360,
      svgOrigin: ILLUSTRATION_CENTER,
      duration: 16,
      ease: 'none',
      repeat: -1,
    }),

  float: () =>
    gsap.to(select('float'), {
      x: -0.8,
      y: -1.6,
      duration: 1.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }),

  twinkle: () =>
    gsap.fromTo(
      select('twinkle'),
      { scale: 1, opacity: 1 },
      {
        scale: 0.4,
        opacity: 0.3,
        transformOrigin: '50% 50%',
        duration: 0.9,
        ease: 'sine.inOut',
        stagger: { each: 0.9, repeat: -1, yoyo: true },
      },
    ),

  fill: () =>
    gsap
      .timeline({ repeat: -1, repeatDelay: 0.6 })
      .from(`${select('fill')} path`, {
        scale: 0,
        transformOrigin: '50% 50%',
        duration: 0.35,
        ease: 'back.out(2)',
        stagger: 0.22,
      })
      .to(`${select('fill')} path`, { opacity: 0, duration: 0.4, delay: 1.4 }),

  draw: () => {
    const length = (index, path) => path.getTotalLength()

    return gsap
      .timeline({ repeat: -1, repeatDelay: 0.6 })
      .fromTo(
        `${select('draw')} path`,
        { strokeDasharray: length, strokeDashoffset: length, opacity: 1 },
        { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', stagger: 0.5 },
      )
      .to(`${select('draw')} path`, { opacity: 0, duration: 0.4, delay: 1.4 })
  },

  shake: () => {
    const pivot = { svgOrigin: ILLUSTRATION_BASE }

    return gsap
      .timeline({ repeat: -1, repeatDelay: 2.4 })
      .fromTo(select('ring'), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
      .to(select('shake'), { ...pivot, rotation: 6, duration: 0.06, ease: 'sine.out' }, 0)
      .to(select('shake'), { ...pivot, rotation: -6, duration: 0.12, ease: 'sine.inOut', repeat: 5, yoyo: true })
      .to(select('shake'), { ...pivot, rotation: 0, duration: 0.06, ease: 'sine.in' })
      .to(select('ring'), { opacity: 0, duration: 0.2 }, '<')
  },
}

/*
  Plays the idle loop of each layer by its data-motion: rays spin, the body floats over its shadow,
  sparkles twinkle in turn, the shapes of a fill layer pop in one by one then clear, the strokes of a
  draw layer draw in one by one then clear, and shake layers rattle on their base every few seconds
  while ring layers flash beside them.
  Only loops with matching layers start.
*/
export function useIllustrationLoop(name = '') {
  const illustrationRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const illustration = illustrationRef.current
    if (prefersReducedMotion || !illustration) return undefined

    const context = gsap.context(() => {
      Object.entries(MOTION_LOOPS).forEach(([motion, play]) => {
        if (illustration.querySelector(select(motion))) play()
      })
    }, illustrationRef)

    return () => context.revert()
  }, [name, prefersReducedMotion])

  return illustrationRef
}
