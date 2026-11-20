import { useSyncExternalStore } from 'react'

export const ROUTES = {
  HABITS: 'habits',
  TASKS: 'tasks',
  NOTES: 'notes',
  SETTINGS: 'settings',
}

const ROUTE_VALUES = Object.values(ROUTES)

function subscribe(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

/* Hash routes keep GitHub Pages working without a server fallback. */
function getSnapshot() {
  const route = window.location.hash.replace(/^#\/?/, '')
  return ROUTE_VALUES.includes(route) ? route : ROUTES.HABITS
}

export function useRoute() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
