import { useMemo } from 'react'
import { useTaskStore } from '../store/useTaskStore'

const byDueDate = (first, second) => first.dueDate.localeCompare(second.dueDate)

/* Splits the tasks of one project (or personal tasks when projectId is null) into dated (soonest first) and general (no date). Done tasks stay in place so rows never jump. */
export function useTaskGroups(projectId = null) {
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(() => {
    const ownTasks = tasks.filter((task) => task.projectId === projectId)
    return {
      dated: ownTasks.filter((task) => task.dueDate).sort(byDueDate),
      general: ownTasks.filter((task) => !task.dueDate),
    }
  }, [tasks, projectId])
}
