import { create } from 'zustand'

export const TOAST_DURATION = 8000

let nextToastId = 1

/*
  One toast at a time. A new toast replaces the current one.
  returnFocus is the element that takes focus when the toast closes while it holds focus.
*/
export const useToastStore = create((set) => ({
  toast: null,

  showToast: ({ message = '', actionLabel = '', onAction = null, returnFocus = null } = {}) =>
    set({ toast: { id: nextToastId++, message, actionLabel, onAction, returnFocus } }),

  dismissToast: (id) => set((state) => (id === undefined || state.toast?.id === id ? { toast: null } : state)),
}))
