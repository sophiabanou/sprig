import { useCallback, useSyncExternalStore } from 'react'

/* Whether the media query matches right now, updating when it starts or stops matching */
export function useMediaQuery(query = '') {
  const subscribe = useCallback(
    (callback) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    [query],
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot)
}
