import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* Projects group work tasks and notes, which point back here through their projectId */
export const useProjectStore = create(
  persist(
    (set) => ({
      projects: [],

      addProject: ({ name = '', tone = 'rose' } = {}) => {
        const trimmedName = name.trim()
        if (!trimmedName) return null

        const now = Date.now()
        const project = { id: crypto.randomUUID(), name: trimmedName, tone, isArchived: false, createdAt: now, updatedAt: now }
        set((state) => ({ projects: [...state.projects, project] }))
        return project.id
      },

      updateProject: (id, changes = {}) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...changes, updatedAt: Date.now() } : project,
          ),
        })),

      /* Archiving is not an edit, so it leaves the project's date alone */
      setArchived: (id, isArchived = true) =>
        set((state) => ({
          projects: state.projects.map((project) => (project.id === id ? { ...project, isArchived } : project)),
        })),
    }),
    { name: 'todo-projects', version: 1 },
  ),
)
