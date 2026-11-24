import { memo, useMemo } from 'react'
import { useListEntrance } from '../../../../hooks/useListEntrance'
import { useToday } from '../../../../hooks/useToday'
import NoteListItem from '../../notes/NoteListItem'
import styles from './ProjectNoteList.module.css'

const byPin = (first, second) => Number(second.isPinned) - Number(first.isPinned)

/* A plain card of notes, pinned first and then last edited first */
function ProjectNoteList({ notes = [], projectId = '', listRef = null, onSelect } = {}) {
  const today = useToday()
  const sortedNotes = useMemo(() => [...notes].sort(byPin), [notes])
  const keys = useMemo(() => sortedNotes.map((note) => note.id), [sortedNotes])
  const entranceRef = useListEntrance(keys, projectId)

  if (notes.length === 0) return <p className={`${styles.empty} textBody`}>No notes yet.</p>

  return (
    <div ref={listRef}>
      <ul ref={entranceRef} className={styles.list}>
        {sortedNotes.map((note) => (
          <NoteListItem key={note.id} note={note} today={today} shouldShowPin onSelect={onSelect} />
        ))}
      </ul>
    </div>
  )
}

export default memo(ProjectNoteList)
