import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { startOfWeek, toDateKey } from '../utils/dates'

export const HABIT_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
}

export const HABIT_COLORS = ['lilac', 'mint', 'peach', 'lemon', 'sky', 'rose']

/* Each icon has its own default color. Picking an icon picks its color, which can then be changed. */
export const HABIT_ICON_COLORS = {
  leaf: 'mint',
  sprout: 'mint',
  toothbrush: 'sky',
  droplet: 'sky',
  coffee: 'peach',
  apple: 'rose',
  pill: 'rose',
  bed: 'lilac',
  moon: 'lilac',
  sun: 'lemon',
  dumbbell: 'peach',
  bike: 'sky',
  heart: 'rose',
  book: 'lilac',
  pencil: 'lemon',
  chat: 'sky',
  film: 'lilac',
  music: 'rose',
  camera: 'peach',
  gamepad: 'lilac',
  phone: 'sky',
  broom: 'lemon',
  cat: 'peach',
  star: 'lemon',
}

export const HABIT_ICONS = Object.keys(HABIT_ICON_COLORS)

/* A period is one day for daily habits and one Monday based week for weekly habits. */
export function getPeriodKey(frequency = HABIT_FREQUENCY.DAILY, date = new Date()) {
  return frequency === HABIT_FREQUENCY.WEEKLY ? toDateKey(startOfWeek(date)) : toDateKey(date)
}

function toTarget(value) {
  const number = Math.floor(Number(value))
  return Number.isFinite(number) && number > 0 ? number : 1
}

/* Moves a habit's count for the period of the given date by delta, kept between 0 and the target. */
function shiftCount(state, id, date, delta) {
  const habit = state.habits.find((item) => item.id === id)
  if (!habit) return state

  const periodKey = getPeriodKey(habit.frequency, date)
  const habitLog = state.log[id] ?? {}
  const current = habitLog[periodKey] ?? 0
  const next = Math.min(Math.max(current + delta, 0), habit.target)
  if (next === current) return state

  return { log: { ...state.log, [id]: { ...habitLog, [periodKey]: next } } }
}

export const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: [],
      log: {},

      addHabit: ({
        name = '',
        description = '',
        frequency = HABIT_FREQUENCY.DAILY,
        target = 1,
        color = null,
        icon = HABIT_ICONS[0],
      } = {}) => {
        const trimmedName = name.trim()
        if (!trimmedName) return null

        const habit = {
          id: crypto.randomUUID(),
          name: trimmedName,
          description: description.trim(),
          frequency,
          target: toTarget(target),
          color: color ?? HABIT_ICON_COLORS[icon] ?? HABIT_COLORS[0],
          icon,
          createdAt: Date.now(),
        }
        set((state) => ({ habits: [...state.habits, habit] }))
        return habit.id
      },

      updateHabit: (id, changes = {}) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  ...changes,
                  target: 'target' in changes ? toTarget(changes.target) : habit.target,
                }
              : habit,
          ),
        })),

      /* Returns a snapshot of the habit, its place and its log, so restoreHabit can undo the removal */
      removeHabit: (id) => {
        const { habits, log } = get()
        const index = habits.findIndex((habit) => habit.id === id)
        if (index === -1) return null

        const { [id]: removedLog, ...restLog } = log
        set({ habits: habits.filter((habit) => habit.id !== id), log: restLog })
        return { habit: habits[index], index, log: removedLog }
      },

      restoreHabit: ({ habit = null, index = 0, log: habitLog } = {}) =>
        set((state) => {
          if (!habit || state.habits.some((item) => item.id === habit.id)) return state
          const habits = [...state.habits]
          habits.splice(Math.min(index, habits.length), 0, habit)
          return { habits, log: habitLog ? { ...state.log, [habit.id]: habitLog } : state.log }
        }),

      logHabit: (id, date = new Date()) => set((state) => shiftCount(state, id, date, 1)),

      unlogHabit: (id, date = new Date()) => set((state) => shiftCount(state, id, date, -1)),
    }),
    { name: 'todo-habits', version: 1 },
  ),
)
