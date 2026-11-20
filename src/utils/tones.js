export function getToneClass(color = 'lilac') {
  return `tone${color.charAt(0).toUpperCase()}${color.slice(1)}`
}
