import { memo, useMemo } from 'react'
import { useListEntrance } from '../../../../hooks/useListEntrance'
import { useNoteGroups } from '../../../../hooks/useNoteGroups'
import { useToday } from '../../../../hooks/useToday'
import { countNotes } from '../../../../utils/notes'
import SearchField from '../../../ui/SearchField'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import NoteGroup from '../NoteGroup'
import styles from './NotesSidebar.module.css'

function NotesSidebar({ notes = [], selectedId = null, query = '', listRef = null, onQueryChange, onSelect } = {}) {
  const today = useToday()
  const { groups, matchCount } = useNoteGroups(notes, query)
  const isSearching = Boolean(query.trim())
  const groupKeys = useMemo(() => groups.map((group) => group.id), [groups])
  const groupsRef = useListEntrance(groupKeys, query)

  return (
    <div className={styles.sidebar}>
      <div className={styles.search}>
        <SearchField label="Search" value={query} onChange={onQueryChange} />
        <VisuallyHidden role="status">{isSearching ? `${countNotes(matchCount)} found` : ''}</VisuallyHidden>
      </div>
      <div ref={listRef} className={styles.scroll}>
        {isSearching && matchCount === 0 && (
          <p className={`${styles.empty} textBody`}>No notes match your search.</p>
        )}
        <div ref={groupsRef} className={styles.groups}>
          {groups.map((group) => (
            <NoteGroup
              key={group.id}
              group={group}
              today={today}
              selectedId={selectedId}
              query={query}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(NotesSidebar)
