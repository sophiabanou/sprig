import { memo, useId } from 'react'
import { useNoteGroups } from '../../../../hooks/useNoteGroups'
import { useToday } from '../../../../hooks/useToday'
import SearchField from '../../../ui/SearchField'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import NoteListItem from '../NoteListItem'
import styles from './NotesSidebar.module.css'

function countNotes(count = 0) {
  return count === 1 ? '1 note' : `${count} notes`
}

function NotesSidebar({ notes = [], selectedId = null, query = '', listRef = null, onQueryChange, onSelect } = {}) {
  const headingId = useId()
  const today = useToday()
  const { groups, matchCount } = useNoteGroups(notes, query)
  const isSearching = Boolean(query.trim())

  return (
    <section className={styles.sidebar} aria-labelledby={headingId}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 id={headingId} className="textHeadingBold">
            Notes
          </h2>
          <span className={`${styles.count} textCaption`}>{countNotes(notes.length)}</span>
        </div>
        <SearchField label="Search" value={query} onChange={onQueryChange} />
        <VisuallyHidden role="status">{isSearching ? `${countNotes(matchCount)} found` : ''}</VisuallyHidden>
      </div>
      <div ref={listRef} className={styles.scroll}>
        {isSearching && matchCount === 0 && (
          <p className={`${styles.empty} textBody`}>No notes match your search.</p>
        )}
        {groups.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3 className={`${styles.groupTitle} textLabel`}>{group.label}</h3>
            <ul className={styles.list}>
              {group.notes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  today={today}
                  isSelected={note.id === selectedId}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(NotesSidebar)
