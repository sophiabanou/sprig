/* Ring geometry on a square viewBox, measured clockwise from twelve o'clock */

const GAP_DEGREES = 14

function toPoint(center, radius, degrees) {
  const radians = ((degrees - 90) * Math.PI) / 180
  return [center + radius * Math.cos(radians), center + radius * Math.sin(radians)]
}

/* One arc path per segment, with an even gap between them */
export function getRingSegments({ count = 1, center = 0, radius = 0 } = {}) {
  const step = 360 / count
  const gap = Math.min(GAP_DEGREES, step / 3)

  return Array.from({ length: count }, (_, index) => {
    const start = index * step + gap / 2
    const end = (index + 1) * step - gap / 2
    const [startX, startY] = toPoint(center, radius, start)
    const [endX, endY] = toPoint(center, radius, end)
    const isLarge = end - start > 180 ? 1 : 0
    return `M${startX.toFixed(2)} ${startY.toFixed(2)}A${radius} ${radius} 0 ${isLarge} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`
  })
}
