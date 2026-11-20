import { memo } from 'react'
import { formatFullDate } from '../../../utils/dates'
import styles from './CalendarDay.module.css'

/* Only the active day is in the tab order. Clicks and keys are handled once by the calendar grid. */
function CalendarDay({ dateKey = '', isActive = false, isSelected = false, isToday = false, isDisabled = false } = {}) {
  return (
    <button
      type="button"
      className={`${styles.day} textBody`}
      tabIndex={isActive ? 0 : -1}
      aria-label={formatFullDate(dateKey)}
      aria-pressed={isSelected}
      aria-current={isToday ? 'date' : undefined}
      aria-disabled={isDisabled || undefined}
      data-date={dateKey}
      data-popover-focus={isActive || undefined}
    >
      {Number(dateKey.slice(8))}
    </button>
  )
}

export default memo(CalendarDay)
