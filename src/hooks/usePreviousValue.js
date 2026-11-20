import { useState } from 'react'

/* Returns the value from before the latest change, tracked in state so it is safe to read during render */
export function usePreviousValue(value) {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState(value)
  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }
  return previous
}
