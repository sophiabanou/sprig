import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* Version 2 adds projectId. Tasks saved before it are personal tasks. */
function migrate(persisted = {}, version = 0) {
  if (version >= 2) return persisted
  const tasks = (persisted.tasks ?? []).map((task) => ({ projectId: null, ...task }))
  return { ...persisted, tasks }
}

/* A task with no projectId is a personal task. Work tasks carry the id of their project. */
export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: ({ title = '', description = '', dueDate = null, projectId = null } = {}) => {
        const trimmedTitle = title.trim()
        if (!trimmedTitle) return null

        const task = {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          description: description.trim(),
          dueDate,
          projectId,
          isDone: false,
          createdAt: Date.now(),
          completedAt: null,
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
        return task.id
      },

      updateTask: (id, changes = {}) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isDone: !task.isDone, completedAt: task.isDone ? null : Date.now() }
              : task,
          ),
        })),

      /* Returns a snapshot of the task and its place, so restoreTask can undo the removal */
      removeTask: (id) => {
        const { tasks } = get()
        const index = tasks.findIndex((task) => task.id === id)
        if (index === -1) return null

        set({ tasks: tasks.filter((task) => task.id !== id) })
        return { task: tasks[index], index }
      },

      restoreTask: ({ task = null, index = 0 } = {}) =>
        set((state) => {
          if (!task || state.tasks.some((item) => item.id === task.id)) return state
          const tasks = [...state.tasks]
          tasks.splice(Math.min(index, tasks.length), 0, task)
          return { tasks }
        }),

      clearCompleted: (projectId = null) =>
        set((state) => ({ tasks: state.tasks.filter((task) => !task.isDone || task.projectId !== projectId) })),
    }),
    { name: 'todo-tasks', version: 2, migrate },
  ),
)
