import { create } from 'zustand'

const REPEAT_MARKER = ' '

/* Repeating the same message would not be read again, so a repeat toggles an invisible trailing space. */
export const useAnnouncerStore = create((set) => ({
  message: '',
  announce: (text = '') =>
    set((state) => ({
      message: state.message === text ? `${text}${REPEAT_MARKER}` : text,
    })),
}))
