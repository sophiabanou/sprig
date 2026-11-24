/*
  Duotone icons on a 24 by 24 grid, matching the heading illustrations at a smaller size.
  Each icon is a list of layers drawn in order.
  Layer kinds: fill (soft fill with an outline), solid (full fill with an outline), line (outline only).
*/
const circle = (cx = 0, cy = 0, r = 1) => `M${cx} ${cy - r}a${r} ${r} 0 1 1 0 ${r * 2}a${r} ${r} 0 1 1 0-${r * 2}z`

export const ICONS = {
  /* Interface */
  check: [{ kind: 'line', d: 'M5 12.5l4.5 4.5L19 7.5' }],
  plus: [{ kind: 'line', d: ['M12 5v14', 'M5 12h14'] }],
  minus: [{ kind: 'line', d: 'M5 12h14' }],
  close: [{ kind: 'line', d: ['M6 6l12 12', 'M18 6L6 18'] }],
  chevronDown: [{ kind: 'line', d: 'M6 9l6 6 6-6' }],
  chevronLeft: [{ kind: 'line', d: 'M15 6l-6 6 6 6' }],
  chevronRight: [{ kind: 'line', d: 'M9 6l6 6-6 6' }],
  sliders: [
    { kind: 'line', d: ['M4 7h9', 'M19 7h1', 'M4 17h1', 'M11 17h9'] },
    { kind: 'fill', d: [circle(16, 7, 2.5), circle(8, 17, 2.5)] },
  ],
  list: [
    { kind: 'line', d: ['M10 6h10', 'M10 12h10', 'M10 18h10'] },
    { kind: 'solid', d: [circle(5, 6, 1), circle(5, 12, 1), circle(5, 18, 1)] },
  ],
  search: [
    { kind: 'fill', d: circle(10.5, 10.5, 6) },
    { kind: 'line', d: 'M15 15l5 5' },
  ],
  pin: [
    { kind: 'fill', d: 'M9 4h6l-1 6 3 3H7l3-3z' },
    { kind: 'line', d: 'M12 13v7' },
  ],
  trash: [
    { kind: 'fill', d: 'M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z' },
    { kind: 'line', d: ['M4 7h16', 'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2', 'M10 11v6', 'M14 11v6'] },
  ],
  calendar: [
    { kind: 'fill', d: 'M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z' },
    { kind: 'solid', d: 'M6 5h12a2 2 0 0 1 2 2v3H4V7a2 2 0 0 1 2-2z' },
    { kind: 'line', d: ['M8 3v3', 'M16 3v3', 'M8.5 14h.01', 'M12 14h.01', 'M15.5 14h.01', 'M8.5 17h.01', 'M12 17h.01'] },
  ],
  archive: [
    { kind: 'fill', d: 'M5 9h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z' },
    { kind: 'solid', d: 'M5 4h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' },
    { kind: 'line', d: 'M10 13h4' },
  ],
  alert: [
    { kind: 'fill', d: 'M12 3.5l9 16H3z' },
    { kind: 'line', d: ['M12 10v4', 'M12 16.8h.01'] },
  ],

  /* Habits */
  leaf: [
    { kind: 'fill', d: 'M5 19C5 10 10 5 20 4c-1 10-6 15-15 15z' },
    { kind: 'line', d: 'M5 19l8-8' },
  ],
  sprout: [
    { kind: 'line', d: 'M12 21v-9' },
    { kind: 'fill', d: ['M12 12c0-4-3-6-7-6 0 4 3 6 7 6z', 'M12 14c0-4 3-7 7-7 0 4-3 7-7 7z'] },
  ],
  toothbrush: [
    { kind: 'line', d: ['M3 15.5h11', 'M15.5 13.5v-4', 'M17.5 13.5v-4', 'M19.5 13.5v-4'] },
    { kind: 'fill', d: 'M14 13.5h7v4h-7z' },
  ],
  droplet: [
    { kind: 'fill', d: 'M12 3c-3 4-6 7.5-6 11a6 6 0 0 0 12 0c0-3.5-3-7-6-11z' },
    { kind: 'line', d: 'M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5' },
  ],
  coffee: [
    { kind: 'fill', d: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z' },
    { kind: 'line', d: ['M16 10h1.5a2.5 2.5 0 0 1 0 5H16', 'M8 3v3', 'M12 3v3'] },
  ],
  apple: [
    { kind: 'fill', d: 'M12 7c-2-1.5-7-1-7 5 0 4 3 8 5 8 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-4 5-8 0-6-5-6.5-7-5z' },
    { kind: 'line', d: 'M12 7c0-2 1-3.5 3-4' },
  ],
  pill: [
    { kind: 'fill', d: 'M10.5 20.5l10-10a4.95 4.95 0 0 0-7-7l-10 10a4.95 4.95 0 0 0 7 7z' },
    { kind: 'solid', d: 'M8.5 8.5l-5 5a4.95 4.95 0 0 0 7 7l5-5z' },
  ],
  bed: [
    { kind: 'fill', d: 'M11 15V9h7a3 3 0 0 1 3 3v3z' },
    { kind: 'solid', d: circle(6.5, 11.5, 1.5) },
    { kind: 'line', d: ['M3 19V6', 'M3 15h18v4'] },
  ],
  moon: [{ kind: 'fill', d: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z' }],
  sun: [
    { kind: 'fill', d: circle(12, 12, 4) },
    {
      kind: 'line',
      d: ['M12 2v2', 'M12 20v2', 'M2 12h2', 'M20 12h2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
    },
  ],
  dumbbell: [
    { kind: 'line', d: ['M7.5 12h9', 'M2.5 10v4', 'M21.5 10v4'] },
    { kind: 'fill', d: ['M4.5 7.5h3v9h-3z', 'M16.5 7.5h3v9h-3z'] },
  ],
  bike: [
    { kind: 'fill', d: [circle(5.5, 17, 3.5), circle(18.5, 17, 3.5)] },
    { kind: 'line', d: ['M5.5 17l4-7h6l3 7', 'M9.5 10l3 7', 'M8 6h3', 'M15.5 10l-1-4h2'] },
  ],
  heart: [{ kind: 'fill', d: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z' }],
  book: [
    {
      kind: 'fill',
      d: [
        'M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z',
        'M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z',
      ],
    },
    { kind: 'line', d: ['M7 8h1.5', 'M15.5 8H17'] },
  ],
  pencil: [
    { kind: 'fill', d: 'M4 20h4L19 9l-4-4L4 16z' },
    { kind: 'line', d: 'M13.5 6.5l4 4' },
  ],
  chat: [
    { kind: 'fill', d: 'M4 5h16v11H9l-5 4z' },
    { kind: 'line', d: ['M9 10.5h.01', 'M12 10.5h.01', 'M15 10.5h.01'] },
  ],
  film: [
    { kind: 'fill', d: 'M4 5h16v14H4z' },
    { kind: 'line', d: ['M8 5v14', 'M16 5v14', 'M4 9.5h4', 'M4 14.5h4', 'M16 9.5h4', 'M16 14.5h4'] },
  ],
  music: [
    { kind: 'line', d: ['M9 18V5', 'M20 16V3'] },
    { kind: 'solid', d: 'M9 5l11-2v3L9 8z' },
    { kind: 'fill', d: [circle(6, 18, 3), circle(17, 16, 3)] },
  ],
  camera: [
    { kind: 'fill', d: 'M4 8h3l2-3h6l2 3h3v11H4z' },
    { kind: 'line', d: circle(12, 13, 3.5) },
  ],
  gamepad: [
    { kind: 'fill', d: 'M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6h-4A4 4 0 0 1 3 13v-1a4 4 0 0 1 4-4z' },
    { kind: 'line', d: ['M7.5 10.5v3', 'M6 12h3', 'M16 11.5h.01', 'M18 13.5h.01'] },
  ],
  phone: [
    { kind: 'fill', d: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z' },
    { kind: 'line', d: 'M11 18h2' },
  ],
  broom: [
    { kind: 'line', d: 'M14 3l-3 9' },
    { kind: 'fill', d: 'M6 12h9l1.5 9h-12z' },
    { kind: 'line', d: ['M8.5 16v5', 'M12 16v5'] },
  ],
  cat: [
    { kind: 'fill', d: 'M5 10V4l4 3h6l4-3v6c0 5-3 9-7 9s-7-4-7-9z' },
    { kind: 'line', d: ['M9.5 12h.01', 'M14.5 12h.01'] },
  ],
  star: [{ kind: 'fill', d: 'M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8z' }],
}
