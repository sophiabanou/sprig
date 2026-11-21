import { memo, useCallback, useMemo } from 'react'
import { formatNoteListDate } from '../../../../utils/dates'
import { getNotePreview, getNoteTitle } from '../../../../utils/notes'
import styles from './NoteListItem.module.css'

function NoteListItem({ note = {}, today = '', isSelected = false, onSelect } = {}) {
  const { id = '', body = '', updatedAt = 0 } = note
  const title = useMemo(() => getNoteTitle(body) || 'New note', [body])
  const preview = useMemo(() => getNotePreview(body) || 'No additional text', [body])

  const handleClick = useCallback(() => onSelect?.(note), [note, onSelect])

  return (
    <li>
      <button
        type="button"
        className={styles.item}
        data-note-id={id}
        aria-current={isSelected ? 'true' : undefined}
        onClick={handleClick}
      >
        <span className={`${styles.title} textButton`}>{title}</span>
        <span className={`${styles.meta} textCaption`}>
          <span className={styles.date}>{formatNoteListDate(updatedAt, today)}</span>
          <span className={styles.preview}>{preview}</span>
        </span>
      </button>
    </li>
  )
}

export default memo(NoteListItem)
