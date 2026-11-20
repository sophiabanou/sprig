import { memo, useCallback, useId } from 'react'
import { useHabitProgress } from '../../../../hooks/useHabitProgress'
import { useHabitActions } from '../../../../hooks/useHabitActions'
import { useRowExit } from '../../../../hooks/useRowExit'
import { HABIT_LAYOUT, useSettingsStore } from '../../../../store/useSettingsStore'
import { getToneClass } from '../../../../utils/tones'
import Checkbox from '../../../ui/Checkbox'
import IconButton from '../../../ui/IconButton'
import HabitPillButton from '../HabitPillButton'
import HabitProgressText from '../HabitProgressText'
import HabitRing from '../HabitRing'
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
  const isSimple = useSettingsStore((state) => state.habitLayout) === HABIT_LAYOUT.SIMPLE
  const { rowRef, exit } = useRowExit()
  const progressId = useId()
  const checkboxId = useId()
  const isSingle = target === 1
  const hasCheckbox = isSimple && isSingle
  const hasUndo = target > 1 && count > 0
  const hasLogPill = isSimple && !isSingle && !isComplete

  /* A pill that disappears hands focus to the control that stays, so it never gets lost */
  const handleLogPill = useCallback(() => {
    if (count + 1 >= target) rowRef.current?.querySelector('[data-habit-pill="undo"]')?.focus()
    handleLog()
  }, [count, target, rowRef, handleLog])

  const handleUndo = useCallback(() => {
    if (count === 1) rowRef.current?.querySelector('[data-habit-ring], [data-habit-pill="log"]')?.focus()
    handleUnlog()
  }, [count, rowRef, handleUnlog])

  const handleEdit = useCallback(() => onEdit?.(habit), [habit, onEdit])
  const handleDelete = useCallback(() => exit(() => onDelete?.(habit)), [habit, onDelete, exit])

  const NameTag = hasCheckbox ? 'label' : 'span'

  return (
    <li
      ref={rowRef}
      className={`${styles.row} ${isSimple ? styles.simple : ''} ${isSimple && !isSingle ? styles.indented : ''} ${getToneClass(color)}`}
    >
      {isSimple ? (
        hasCheckbox && (
          <div className={styles.control}>
            <Checkbox id={checkboxId} isChecked={isComplete} onChange={handleToggle} describedBy={progressId} />
          </div>
        )
      ) : (
        <HabitRing
          name={name}
          icon={icon}
          count={count}
          target={target}
          describedBy={progressId}
          onLog={handleLog}
          onToggle={handleToggle}
        />
      )}
      <div className={styles.text}>
        <NameTag
          htmlFor={hasCheckbox ? checkboxId : undefined}
          className={`${styles.name} ${hasCheckbox ? styles.clickable : ''} textButton`}
        >
          {name}
        </NameTag>
        <span className={styles.progress}>
          <HabitProgressText
            id={progressId}
            count={count}
            target={target}
            periodText={periodText}
            isComplete={isComplete}
          />
          <HabitPillButton
            text="Log"
            name={name}
            icon="plus"
            kind="log"
            isVisible={hasLogPill}
            shouldKeepSpace={isSimple && !isSingle}
            describedBy={progressId}
            onClick={handleLogPill}
          />
          <HabitPillButton text="Undo" name={name} kind="undo" isVisible={hasUndo} onClick={handleUndo} />
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
