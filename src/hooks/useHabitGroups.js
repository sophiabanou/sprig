import { useMemo } from 'react'
import { HABIT_FREQUENCY, useHabitStore } from '../store/useHabitStore'

export function useHabitGroups() {
  const habits = useHabitStore((state) => state.habits)

  return useMemo(
    () => ({
      daily: habits.filter((habit) => habit.frequency === HABIT_FREQUENCY.DAILY),
      weekly: habits.filter((habit) => habit.frequency === HABIT_FREQUENCY.WEEKLY),
    }),
    [habits],
  )
}
