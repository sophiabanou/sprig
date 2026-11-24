export const TONES = ['lilac', 'mint', 'peach', 'lemon', 'sky', 'rose']

export const TONE_LABELS = {
  lilac: 'Lilac',
  mint: 'Mint',
  peach: 'Peach',
  lemon: 'Lemon',
  sky: 'Sky',
  rose: 'Rose',
}

export function getToneClass(color = 'lilac') {
  return `tone${color.charAt(0).toUpperCase()}${color.slice(1)}`
}
