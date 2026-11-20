import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const HABIT_LAYOUT = {
  RINGS: 'rings',
  SIMPLE: 'simple',
}

export const useSettingsStore = create(
  persist(
    (set) => ({
      habitLayout: HABIT_LAYOUT.RINGS,
      setHabitLayout: (habitLayout) => set({ habitLayout }),
    }),
    { name: 'todo-settings', version: 1 },
  ),
)
