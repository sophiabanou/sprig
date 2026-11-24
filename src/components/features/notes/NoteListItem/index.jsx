import { memo, useCallback, useMemo } from 'react'
import { formatNoteListDate } from '../../../../utils/dates'
import { getNotePreview, getNoteTitle } from '../../../../utils/notes'
import Icon from '../../../ui/Icon'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import styles from './NoteListItem.module.css'

/* shouldShowPin marks pinned notes, for lists that do not group them under a Pinned heading */
function NoteListItem({ note = {}, today = '', isSelected = false, shouldShowPin = false, onSelect } = {}) {
  const { id = '', body = '', updatedAt = 0, isPinned = false } = note
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
        <span className={styles.titleRow}>
          <span className={`${styles.title} textButton`}>{title}</span>
          {shouldShowPin && isPinned && (
            <span className={styles.pin}>
              <Icon name="pin" size="sm" />
              <VisuallyHidden>Pinned</VisuallyHidden>
            </span>
          )}
        </span>
        <span className={`${styles.meta} textCaption`}>
          <span className={styles.date}>{formatNoteListDate(updatedAt, today)}</span>
          <span className={styles.preview}>{preview}</span>
        </span>
      </button>
    </li>
  )
}

export default memo(NoteListItem)
