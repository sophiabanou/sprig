import { useMemo } from 'react'
import { getPeriodKey, useHabitStore } from '../store/useHabitStore'
import { fromDateKey } from '../utils/dates'
import { useToday } from './useToday'

export function useCompletedHabitCount(habits = []) {
  const log = useHabitStore((state) => state.log)
  const today = useToday()

  return useMemo(() => {
    const date = fromDateKey(today)
    return habits.filter((habit) => {
      const count = log[habit.id]?.[getPeriodKey(habit.frequency, date)] ?? 0
      return count >= habit.target
    }).length
  }, [habits, log, today])
}
