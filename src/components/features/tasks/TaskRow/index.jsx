import { memo, useCallback, useId } from 'react'
import { useRowExit } from '../../../../hooks/useRowExit'
import { useStrikeThrough } from '../../../../hooks/useStrikeThrough'
import { useTaskStore } from '../../../../store/useTaskStore'
import Checkbox from '../../../ui/Checkbox'
import IconButton from '../../../ui/IconButton'
import TaskDueText from '../TaskDueText'
import styles from './TaskRow.module.css'

function TaskRow({ task = {}, onEdit, onDelete } = {}) {
  const { id, title, description = '', dueDate, isDone } = task
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const inputId = useId()
  const dueId = useId()

  const handleToggle = useCallback(() => toggleTask(id), [id, toggleTask])
  const { rowRef, exit } = useRowExit()
  const strikeRef = useStrikeThrough(isDone)

  const handleEdit = useCallback(() => onEdit?.(task), [task, onEdit])
  const handleDelete = useCallback(() => exit(() => onDelete?.(task)), [task, onDelete, exit])

  return (
    <li ref={rowRef} className={styles.row}>
      <div className={styles.checkbox}>
        <Checkbox
          id={inputId}
          isChecked={isDone}
          onChange={handleToggle}
          describedBy={dueDate ? dueId : undefined}
        />
      </div>
      <div className={styles.text}>
        <label htmlFor={inputId} className={`${styles.title} textButton`}>
          <span ref={strikeRef} className={`${styles.strike} ${isDone ? styles.done : ''}`}>
            {title}
          </span>
        </label>
        {dueDate && <TaskDueText id={dueId} dueDate={dueDate} isDone={isDone} />}
        {description && <p className={`${styles.description} textCaption`}>{description}</p>}
      </div>
      <div className={styles.actions}>
        <IconButton label={`Edit ${title}`} icon="pencil" onClick={handleEdit} />
        <IconButton label={`Delete ${title}`} icon="trash" onClick={handleDelete} />
      </div>
    </li>
  )
}

export default memo(TaskRow)
