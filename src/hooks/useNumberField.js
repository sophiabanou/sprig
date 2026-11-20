import { useCallback } from 'react'

/* Steps a numeric string within min and max. Typing stays free so the field can be cleared while editing. */
export function useNumberField({ value = '', min = 0, max = Infinity, onChange } = {}) {
  const number = Number(value)
  const isAtMin = number <= min
  const isAtMax = number >= max

  const step = useCallback(
    (delta) => {
      const current = Number.isFinite(number) ? number : min
      onChange?.(String(Math.min(Math.max(current + delta, min), max)))
    },
    [number, min, max, onChange],
  )

  const handleDecrease = useCallback(() => step(-1), [step])
  const handleIncrease = useCallback(() => step(1), [step])
  const handleInputChange = useCallback((event) => onChange?.(event.target.value), [onChange])

  return { isAtMin, isAtMax, handleDecrease, handleIncrease, handleInputChange }
}
