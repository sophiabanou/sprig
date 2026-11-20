import { useEffect, useState } from 'react'
import { msUntilTomorrow, toDateKey } from '../utils/dates'

/* Returns today's date key and rerenders at midnight so daily habits reset while the app is open. */
export function useToday() {
  const [today, setToday] = useState(() => toDateKey())

  useEffect(() => {
    const timeoutId = setTimeout(() => setToday(toDateKey()), msUntilTomorrow() + 1000)
    return () => clearTimeout(timeoutId)
  }, [today])

  return today
}
