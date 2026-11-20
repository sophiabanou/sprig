import { memo, useCallback, useId } from 'react'
import { useRowExit } from '../../../../hooks/useRowExit'
import { useTaskStore } from '../../../../store/useTaskStore'
import Checkbox from '../../../ui/Checkbox'
import IconButton from '../../../ui/IconButton'
import TaskDueText from '../TaskDueText'
import styles from './TaskRow.module.css'

function TaskRow({ task = {}, onDelete } = {}) {
  const { id, title, dueDate, isDone } = task
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const inputId = useId()
  const dueId = useId()

  const handleToggle = useCallback(() => toggleTask(id), [id, toggleTask])
  const { rowRef, exit } = useRowExit()

  const handleDelete = useCallback(() => exit(() => onDelete?.(task)), [task, onDelete, exit])

  return (
    <li ref={rowRef} className={styles.row}>
      <Checkbox
        id={inputId}
        isChecked={isDone}
        onChange={handleToggle}
        describedBy={dueDate ? dueId : undefined}
      />
      <div className={styles.text}>
        <label htmlFor={inputId} className={`${styles.title} ${isDone ? styles.done : ''} textButton`}>
          {title}
        </label>
        {dueDate && <TaskDueText id={dueId} dueDate={dueDate} isDone={isDone} />}
      </div>
      <IconButton label={`Delete ${title}`} icon="trash" onClick={handleDelete} />
    </li>
  )
}

export default memo(TaskRow)
