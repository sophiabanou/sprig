import { useMemo } from 'react'

/* Projects whose name holds the search text, ignoring case */
export function useProjectSearch(projects = [], query = '') {
  return useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle ? projects.filter((project) => project.name.toLowerCase().includes(needle)) : projects
  }, [projects, query])
}
