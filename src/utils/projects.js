export function countProjects(count = 0) {
  return count === 1 ? '1 project' : `${count} projects`
}

export const PROJECT_TAB = {
  TASKS: 'tasks',
  NOTES: 'notes',
}
