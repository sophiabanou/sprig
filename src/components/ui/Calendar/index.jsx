import { memo, useCallback, useId } from 'react'
import { useCalendar } from '../../../hooks/useCalendar'
import { useMonthSlide } from '../../../hooks/useMonthSlide'
import { useToday } from '../../../hooks/useToday'
import { WEEKDAYS, formatMonth } from '../../../utils/dates'
import CalendarDay from '../CalendarDay'
import IconButton from '../IconButton'
import styles from './Calendar.module.css'

function Calendar({ value = '', min = '', isOpen = false, onSelect } = {}) {
  const monthId = useId()
  const today = useToday()
  const { gridRef, activeKey, monthKey, weeks, isAtMinMonth, handlePreviousMonth, handleNextMonth, handleKeyDown } =
    useCalendar({ value, min, today, isOpen })
  const bodyRef = useMonthSlide(monthKey)

  const handleClick = useCallback(
    (event) => {
      const day = event.target.closest('[data-date]')
      if (!day || day.getAttribute('aria-disabled') === 'true') return
      onSelect?.(day.dataset.date)
    },
    [onSelect],
  )

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <IconButton label="Previous month" icon="chevronLeft" hasLift={false} onClick={handlePreviousMonth} isDisabled={isAtMinMonth} />
        <p id={monthId} className={`${styles.month} textLabel`} aria-live="polite">
          {formatMonth(monthKey)}
        </p>
        <IconButton label="Next month" icon="chevronRight" hasLift={false} onClick={handleNextMonth} />
      </div>
      <table ref={gridRef} className={styles.grid} aria-labelledby={monthId} onClick={handleClick} onKeyDown={handleKeyDown}>
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th key={weekday.long} scope="col" abbr={weekday.long} className={`${styles.weekday} textCaption`}>
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((dateKey, dayIndex) => (
                <td key={dayIndex} className={styles.cell}>
                  {dateKey && (
                    <CalendarDay
                      dateKey={dateKey}
                      isActive={dateKey === activeKey}
                      isSelected={dateKey === value}
                      isToday={dateKey === today}
                      isDisabled={Boolean(min) && dateKey < min}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(Calendar)
