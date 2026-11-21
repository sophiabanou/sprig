/*
  Heading illustrations on a 48 by 48 grid. Each is a list of layers drawn in order.
  Layer kinds: shadow (hard ink offset), body (tone fill with ink outline), line (ink stroke),
  detail (tone ink stroke on the fill), blush (vivid tone fill), accent (vivid tone fill with ink outline),
  dot (tone ink fill), sparkle (tone stroke on the surface).
  An optional tone overrides the tone of the surrounding element for that layer.
  An optional motion lists the loops the layer plays in useIllustrationLoop: spin, float, twinkle, fill, draw, shake or ring.
*/
const circle = (cx = 0, cy = 0, r = 1) => `M${cx} ${cy - r}a${r} ${r} 0 1 1 0 ${r * 2}a${r} ${r} 0 1 1 0-${r * 2}z`

const WEEK_DAYS = [
  [15, 25], [21, 25], [27, 25], [33, 25],
  [15, 32], [21, 32], [27, 32],
]

export const ILLUSTRATIONS = {
  sun: [
    { kind: 'shadow', d: 'M26.5 15.5a11 11 0 1 1 0 22a11 11 0 1 1 0-22z' },
    {
      kind: 'line',
      motion: 'spin',
      d: [
        'M24 3v5', 'M24 40v5', 'M3 24h5', 'M40 24h5',
        'M13 13l-2.4-2.4', 'M35 13l2.4-2.4', 'M13 35l-2.4 2.4', 'M35 35l2.4 2.4',
      ],
    },
    { kind: 'body', motion: 'float', d: 'M24 13a11 11 0 1 1 0 22a11 11 0 1 1 0-22z' },
    {
      kind: 'blush',
      motion: 'float',
      d: ['M17.8 25a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 1 1 0-3.2z', 'M30.2 25a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 1 1 0-3.2z'],
    },
    {
      kind: 'detail',
      motion: 'float',
      d: ['M18.5 22.5c.8-1.2 2.7-1.2 3.5 0', 'M26 22.5c.8-1.2 2.7-1.2 3.5 0', 'M20.5 27c1.8 2.2 5.2 2.2 7 0'],
    },
    { kind: 'sparkle', motion: 'twinkle', d: ['M42 3.5v5', 'M39.5 6h5'] },
    { kind: 'sparkle', motion: 'twinkle', d: ['M6 39.5v5', 'M3.5 42h5'] },
  ],
  week: [
    { kind: 'shadow', d: 'M14.5 12.5h24a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4h-24a4 4 0 0 1-4-4v-22a4 4 0 0 1 4-4z' },
    { kind: 'body', motion: 'float', d: 'M12 10h24a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z' },
    { kind: 'accent', motion: 'float', d: 'M12 10h24a4 4 0 0 1 4 4v4H8v-4a4 4 0 0 1 4-4z' },
    { kind: 'line', motion: 'float', d: ['M17 6v7', 'M31 6v7'] },
    { kind: 'dot', motion: 'float fill', d: WEEK_DAYS.map(([cx, cy]) => circle(cx, cy, 1.8)) },
    { kind: 'sparkle', motion: 'twinkle', d: ['M43 3.5v5', 'M40.5 6h5'] },
  ],
  clock: [
    { kind: 'shadow', d: circle(26.5, 26.5, 13) },
    { kind: 'line', motion: 'shake', d: ['M16 34l-3 4.5', 'M32 34l3 4.5', 'M24 7v4', 'M21.5 7h5'] },
    { kind: 'accent', motion: 'shake', d: ['M11.63 20.11A6 6 0 0 1 20.11 11.63z', 'M27.89 11.63A6 6 0 0 1 36.37 20.11z'] },
    { kind: 'body', motion: 'shake', d: circle(24, 24, 13) },
    { kind: 'detail', motion: 'shake', d: ['M24 14v1', 'M24 33v1', 'M14 24h1', 'M33 24h1'] },
    { kind: 'detail', motion: 'shake', d: 'M24 24h5' },
    { kind: 'detail', motion: 'shake spin', d: 'M24 24v-6.5' },
    { kind: 'dot', motion: 'shake', d: circle(24, 24, 1.5) },
    { kind: 'sparkle', motion: 'ring', d: ['M7 7L4.5 4.5', 'M5.5 13H3', 'M13 5.5V3', 'M41 7l2.5-2.5', 'M42.5 13H45', 'M35 5.5V3'] },
  ],
  checklist: [
    { kind: 'shadow', d: 'M16.5 11.5h20a3 3 0 0 1 3 3v27a3 3 0 0 1-3 3h-20a3 3 0 0 1-3-3v-27a3 3 0 0 1 3-3z' },
    { kind: 'body', motion: 'float', d: 'M14 9h20a3 3 0 0 1 3 3v27a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z' },
    { kind: 'accent', motion: 'float', d: 'M21 6h6a2 2 0 0 1 2 2v4H19V8a2 2 0 0 1 2-2z' },
    { kind: 'detail', motion: 'float', d: ['M23.5 20H33', 'M23.5 27H31', 'M23.5 34H32'] },
    { kind: 'detail', motion: 'float draw', d: ['M15 20l1.6 1.6 3.4-3.4', 'M15 27l1.6 1.6 3.4-3.4', 'M15 34l1.6 1.6 3.4-3.4'] },
    { kind: 'sparkle', motion: 'twinkle', d: ['M43 4.5v5', 'M40.5 7h5'] },
    { kind: 'sparkle', motion: 'twinkle', d: ['M5 37.5v5', 'M2.5 40h5'] },
  ],
  notepad: [
    { kind: 'shadow', d: 'M14.5 10.5h20a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3h-20a3 3 0 0 1-3-3v-28a3 3 0 0 1 3-3z' },
    { kind: 'body', motion: 'float', d: 'M12 8h20a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z' },
    { kind: 'line', motion: 'float', d: ['M16 5v6', 'M22 5v6', 'M28 5v6'] },
    { kind: 'detail', motion: 'float draw', d: ['M15 19h14', 'M15 25h14', 'M15 31h8'] },
    { kind: 'accent', motion: 'float', d: 'M30 33l11-11 4 4-11 11-5.5 1.5z' },
    { kind: 'line', motion: 'float', d: 'M30 33l4 4' },
    { kind: 'sparkle', motion: 'twinkle', d: ['M43 4.5v5', 'M40.5 7h5'] },
    { kind: 'sparkle', motion: 'twinkle', d: ['M5 37.5v5', 'M2.5 40h5'] },
  ],
  logo: [
    { kind: 'shadow', d: 'M22.5 23.5h8a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z' },
    { kind: 'line', d: 'M24 21V10' },
    { kind: 'accent', tone: 'mint', d: ['M24 16c0-5-4-8-10-8 0 5 4 8 10 8z', 'M24 13c0-5 4-9 10-9 0 5-4 9-10 9z'] },
    { kind: 'body', tone: 'lilac', d: 'M20 21h8a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z' },
    { kind: 'detail', tone: 'lilac', d: 'M19.75 33.25l3 3 6-6' },
  ],
}
