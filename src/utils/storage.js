/*
  localStorage that batches writes, for stores that change on every keystroke. Reads see pending
  values right away, and everything pending is written when the page is hidden or closed.
*/
export function createDebouncedStorage(delay = 300) {
  const pending = new Map()
  let timeoutId = null

  const flush = () => {
    clearTimeout(timeoutId)
    timeoutId = null
    pending.forEach((value, name) => localStorage.setItem(name, value))
    pending.clear()
  }

  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })

  return {
    getItem: (name) => (pending.has(name) ? pending.get(name) : localStorage.getItem(name)),
    setItem: (name, value) => {
      pending.set(name, value)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(flush, delay)
    },
    removeItem: (name) => {
      pending.delete(name)
      localStorage.removeItem(name)
    },
  }
}
