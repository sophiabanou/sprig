/*
  Shared entrance motion so every part of a page arrives the same way.
  Parts rise by the same distance with the same ease, small marks pop with one shared overshoot,
  and the page plays top to bottom: header, then tabs, then the list.
*/
export const ENTRANCE = {
  ease: 'power3.out',
  popEase: 'back.out(1.8)',
  duration: 0.5,
  rise: 14,
  fieldRise: 6,
  fieldDuration: 0.3,
  stagger: 0.06,
  letterStagger: 0.03,
}

export const ENTRANCE_DELAY = {
  header: 0,
  tabs: 0.2,
  panel: 0.4,
}

/* A quick fade for swapping the last row of a list with its empty state */
export const SWAP_DURATION = 0.15

/* Seconds per character when the typewriter types and erases */
export const TYPEWRITER = {
  type: 0.055,
  erase: 0.025,
}
