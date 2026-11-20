import { useCallback } from 'react'
import { HABIT_FREQUENCY, useHabitStore } from '../store/useHabitStore'
import { useAnnouncerStore } from '../store/useAnnouncerStore'

/* Log and undo handlers for one habit. Each change is announced with the new count. */
export function useHabitActions({ id = '', name = '', frequency = HABIT_FREQUENCY.DAILY, target = 1, count = 0 } = {}) {
  const logHabit = useHabitStore((state) => state.logHabit)
  const unlogHabit = useHabitStore((state) => state.unlogHabit)
  const announce = useAnnouncerStore((state) => state.announce)
  const periodText = frequency === HABIT_FREQUENCY.WEEKLY ? 'this week' : 'today'

  const handleLog = useCallback(() => {
    if (count >= target) return
    logHabit(id)
    announce(`${name}, ${count + 1} of ${target} ${periodText}`)
  }, [id, name, count, target, periodText, logHabit, announce])

  const handleUnlog = useCallback(() => {
    if (count <= 0) return
    unlogHabit(id)
    announce(`${name}, ${count - 1} of ${target} ${periodText}`)
  }, [id, name, count, target, periodText, unlogHabit, announce])

  const handleToggle = useCallback(() => {
    if (count >= target) unlogHabit(id)
    else logHabit(id)
  }, [id, count, target, logHabit, unlogHabit])

  return { periodText, handleLog, handleUnlog, handleToggle }
}
