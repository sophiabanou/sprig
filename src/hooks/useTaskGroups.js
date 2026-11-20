import { useMemo } from 'react'
import { useTaskStore } from '../store/useTaskStore'

const byDueDate = (first, second) => first.dueDate.localeCompare(second.dueDate)

/* Splits tasks into dated (soonest first) and general (no date). Done tasks stay in place so rows never jump. */
export function useTaskGroups() {
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(
    () => ({
      dated: tasks.filter((task) => task.dueDate).sort(byDueDate),
      general: tasks.filter((task) => !task.dueDate),
    }),
    [tasks],
  )
}
