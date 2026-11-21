import { useMemo } from 'react'
import { useNoteStore } from '../store/useNoteStore'

const byLastEdit = (first, second) => second.updatedAt - first.updatedAt

/* Notes for one project, or simple notes when projectId is null, last edited first */
export function useNotes(projectId = null) {
  const notes = useNoteStore((state) => state.notes)

  return useMemo(() => notes.filter((note) => note.projectId === projectId).sort(byLastEdit), [notes, projectId])
}
