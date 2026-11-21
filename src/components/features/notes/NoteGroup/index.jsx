import { memo, useMemo } from 'react'
import { useListEntrance } from '../../../../hooks/useListEntrance'
import NoteListItem from '../NoteListItem'
import styles from './NoteGroup.module.css'

/* One date group of the note list. Notes added in place open up and fade in, a change of search does not animate. */
function NoteGroup({ group = {}, today = '', selectedId = null, query = '', onSelect } = {}) {
  const { label = '', notes = [] } = group
  const keys = useMemo(() => notes.map((note) => note.id), [notes])
  const listRef = useListEntrance(keys, query)

  return (
    <div className={styles.group}>
      <h3 className={`${styles.title} textLabel`}>{label}</h3>
      <ul ref={listRef} className={styles.list}>
        {notes.map((note) => (
          <NoteListItem key={note.id} note={note} today={today} isSelected={note.id === selectedId} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  )
}

export default memo(NoteGroup)
