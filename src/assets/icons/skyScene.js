/* The sky switch scene on a 104 by 48 grid. The orb starts on the left as the sun and travels right to become the moon.
   The rays stay a few units inside the pill so they never touch its edge. */
const circle = (cx = 0, cy = 0, r = 1) => `M${cx} ${cy - r}a${r} ${r} 0 1 1 0 ${r * 2}a${r} ${r} 0 1 1 0-${r * 2}z`

const RAY_COUNT = 8
const RAY_INNER = 16
const RAY_OUTER = 19

export const SKY_SCENE = {
  width: 104,
  height: 48,
  orb: { cx: 24, cy: 24, r: 12 },
  travel: 56,
  bite: {
    r: 10,
    day: { cx: 48, cy: 20 },
    night: { cx: 30, cy: 20 },
  },
  rays: Array.from({ length: RAY_COUNT }, (_, index) => {
    const angle = (index / RAY_COUNT) * Math.PI * 2
    const point = (radius) => `${(24 + Math.cos(angle) * radius).toFixed(2)} ${(24 + Math.sin(angle) * radius).toFixed(2)}`
    return `M${point(RAY_INNER)}L${point(RAY_OUTER)}`
  }),
  clouds: [
    'M58 38h16a4.5 4.5 0 0 0 0-9a6.5 6.5 0 0 0-12-2.5a5.5 5.5 0 0 0-4 11.5z',
    'M78 22h11a3.5 3.5 0 0 0 0-7a5 5 0 0 0-9-1.5a4 4 0 0 0-2 8.5z',
  ],
  stars: [circle(14, 15, 1.6), circle(26, 33, 1.3), circle(36, 13, 1.9), circle(50, 29, 1.4), circle(56, 14, 1.1)],
}
