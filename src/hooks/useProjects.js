import { useMemo } from 'react'
import { useProjectStore } from '../store/useProjectStore'
import { useTaskStore } from '../store/useTaskStore'

const byName = (first, second) => first.name.localeCompare(second.name, undefined, { sensitivity: 'base' })

/* Projects in name order, split into active and archived, each with its count of tasks still to do */
export function useProjects() {
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(() => {
    const openCounts = new Map()
    tasks.forEach((task) => {
      if (task.projectId && !task.isDone) openCounts.set(task.projectId, (openCounts.get(task.projectId) ?? 0) + 1)
    })
    const counted = projects.map((project) => ({ ...project, openCount: openCounts.get(project.id) ?? 0 })).sort(byName)
    const activeProjects = counted.filter((project) => !project.isArchived)
    const archivedProjects = counted.filter((project) => project.isArchived)
    return { activeProjects, archivedProjects, allProjects: [...activeProjects, ...archivedProjects] }
  }, [projects, tasks])
}
