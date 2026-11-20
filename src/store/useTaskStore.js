import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: ({ title = '', dueDate = null } = {}) => {
        const trimmedTitle = title.trim()
        if (!trimmedTitle) return null

        const task = {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          dueDate,
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

      clearCompleted: () =>
        set((state) => ({ tasks: state.tasks.filter((task) => !task.isDone) })),
    }),
    { name: 'todo-tasks', version: 1 },
  ),
)
