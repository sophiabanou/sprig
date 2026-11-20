import { useState } from 'react'

/* Holds on to the last non empty value, so content can stay on screen while it animates away */
export function useLastValue(value) {
  const [lastValue, setLastValue] = useState(value)
  if (value && value !== lastValue) setLastValue(value)
  return value || lastValue
}
