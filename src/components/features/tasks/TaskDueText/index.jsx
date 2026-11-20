import { memo } from 'react'
import { useToday } from '../../../../hooks/useToday'
import { formatDueLabel } from '../../../../utils/dates'
import Icon from '../../../ui/Icon'
import styles from './TaskDueText.module.css'

function TaskDueText({ id = '', dueDate = '', isDone = false } = {}) {
  const today = useToday()
  const isOverdue = !isDone && dueDate < today

  return (
    <span id={id} className={`${styles.text} ${isOverdue ? styles.overdue : ''} textCaption`}>
      <Icon name={isOverdue ? 'alert' : 'calendar'} size="sm" />
      {formatDueLabel(dueDate, today)}
    </span>
  )
}

export default memo(TaskDueText)
