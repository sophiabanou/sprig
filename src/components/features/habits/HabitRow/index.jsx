import { memo, useCallback, useId } from 'react'
import { useHabitProgress } from '../../../../hooks/useHabitProgress'
import { useHabitActions } from '../../../../hooks/useHabitActions'
import { useRowExit } from '../../../../hooks/useRowExit'
import { getToneClass } from '../../../../utils/tones'
import IconButton from '../../../ui/IconButton'
import HabitProgressText from '../HabitProgressText'
import HabitRing from '../HabitRing'
import HabitUndoButton from '../HabitUndoButton'
import styles from './HabitRow.module.css'

function HabitRow({ habit = {}, onEdit, onDelete } = {}) {
  const { id, name, description = '', frequency, target, color, icon } = habit
  const { count, isComplete } = useHabitProgress(habit)
  const { periodText, handleLog, handleUnlog, handleToggle } = useHabitActions({
    id,
    name,
    frequency,
    target,
    count,
  })
  const { rowRef, exit } = useRowExit()
  const progressId = useId()
  const hasUndo = target > 1 && count > 0

  /* The last undo removes the button, so focus moves back to the ring instead of getting lost */
  const handleUndo = useCallback(() => {
    if (count === 1) rowRef.current?.querySelector('[data-habit-ring]')?.focus()
    handleUnlog()
  }, [count, rowRef, handleUnlog])

  const handleEdit = useCallback(() => onEdit?.(habit), [habit, onEdit])
  const handleDelete = useCallback(() => exit(() => onDelete?.(habit)), [habit, onDelete, exit])

  return (
    <li ref={rowRef} className={`${styles.row} ${getToneClass(color)}`}>
      <HabitRing
        name={name}
        icon={icon}
        count={count}
        target={target}
        describedBy={progressId}
        onLog={handleLog}
        onToggle={handleToggle}
      />
      <div className={styles.text}>
        <span className={`${styles.name} textButton`}>{name}</span>
        <span className={styles.progress}>
          <HabitProgressText
            id={progressId}
            count={count}
            target={target}
            periodText={periodText}
            isComplete={isComplete}
          />
          <HabitUndoButton name={name} isVisible={hasUndo} onClick={handleUndo} />
        </span>
        {description && <p className={`${styles.description} textCaption`}>{description}</p>}
      </div>
      <div className={styles.actions}>
        <IconButton label={`Edit ${name}`} icon="pencil" onClick={handleEdit} />
        <IconButton label={`Delete ${name}`} icon="trash" onClick={handleDelete} />
      </div>
    </li>
  )
}

export default memo(HabitRow)
