import { useHabitStore } from '../store/useHabitStore'
import { useUndoableDelete } from './useUndoableDelete'

/* Deletes a habit together with its log, which restoring brings back. */
export function useHabitDelete() {
  const remove = useHabitStore((state) => state.removeHabit)
  const restore = useHabitStore((state) => state.restoreHabit)
  return useUndoableDelete({ noun: 'Habit', remove, restore })
}
