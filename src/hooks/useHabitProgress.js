import { useMemo } from 'react'
import { getPeriodKey, HABIT_FREQUENCY, useHabitStore } from '../store/useHabitStore'
import { fromDateKey } from '../utils/dates'
import { useToday } from './useToday'

export function useHabitProgress({ id = '', frequency = HABIT_FREQUENCY.DAILY, target = 1 } = {}) {
  const today = useToday()
  const periodKey = useMemo(() => getPeriodKey(frequency, fromDateKey(today)), [frequency, today])
  const count = useHabitStore((state) => state.log[id]?.[periodKey] ?? 0)

  return useMemo(
    () => ({ count, target, isComplete: count >= target }),
    [count, target],
  )
}
