import { memo, useCallback, useMemo } from 'react'
import { useNoteStore } from '../../../../store/useNoteStore'
import { formatNoteStamp } from '../../../../utils/dates'
import IconButton from '../../../ui/IconButton'
import RichTextEditor from '../../../ui/RichTextEditor'
import styles from './NoteEditor.module.css'

/* Edits one note and saves as you type. Remount it with the note id as key to switch notes. */
function NoteEditor({ note = {}, isAutoFocused = false, onBack, onDelete } = {}) {
  const { id = '', body = '', isPinned = false, createdAt = 0, updatedAt = createdAt } = note
  const updateNote = useNoteStore((state) => state.updateNote)
  const togglePin = useNoteStore((state) => state.togglePin)

  const handleChange = useCallback((text = '') => updateNote(id, { body: text }), [id, updateNote])
  const handlePin = useCallback(() => togglePin(id), [id, togglePin])
  const handleDelete = useCallback(() => onDelete?.(note), [note, onDelete])

  const stamp = useMemo(
    () => (
      <time dateTime={new Date(updatedAt).toISOString()} className={`${styles.stamp} textCaption`}>
        {formatNoteStamp(updatedAt)}
      </time>
    ),
    [updatedAt],
  )

  return (
    <div className={styles.note}>
      <div className={styles.bar}>
        <span className={styles.back}>
          <IconButton label="Back to notes" icon="chevronLeft" hasLift={false} onClick={onBack} />
        </span>
        <div className={styles.actions}>
          <IconButton label="Pin note" icon="pin" hasLift={false} isPressed={isPinned} onClick={handlePin} />
          <IconButton label="Delete note" icon="trash" hasLift={false} onClick={handleDelete} />
        </div>
      </div>
      <RichTextEditor
        initialValue={body}
        label="Note"
        titlePlaceholder="Title"
        isAutoFocused={isAutoFocused}
        header={stamp}
        onChange={handleChange}
      />
    </div>
  )
}

export default memo(NoteEditor)
