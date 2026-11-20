import { memo, useCallback, useId } from 'react'
import { usePopover } from '../../../hooks/usePopover'
import { formatFieldDate } from '../../../utils/dates'
import Calendar from '../Calendar'
import FieldError from '../FieldError'
import Icon from '../Icon'
import Popover from '../Popover'
import styles from './DateField.module.css'

const PLACEHOLDER = 'Choose a date'

/*
  A pill that opens a calendar popover. Like a select, the name comes from the visible label
  and the chosen date is read as the description, so the name never changes with the value.
*/
function DateField({ label = '', value = '', onChange, min = '', error = '', isAutoFocused = false } = {}) {
  const id = useId()
  const labelId = `${id}label`
  const valueId = `${id}value`
  const errorId = `${id}error`
  const popoverId = `${id}popover`
  const { anchorRef, panelRef, isOpen, close } = usePopover()

  const handleSelect = useCallback(
    (dateKey = '') => {
      onChange?.(dateKey)
      close()
    },
    [onChange, close],
  )

  return (
    <div className={styles.field}>
      <span id={labelId} className={`${styles.label} textLabel`}>
        {label}
      </span>
      <div ref={anchorRef} className={styles.anchor}>
        <button
          type="button"
          className={`${styles.trigger} textBody`}
          popoverTarget={popoverId}
          aria-labelledby={labelId}
          aria-describedby={error ? `${valueId} ${errorId}` : valueId}
          data-invalid={Boolean(error) || undefined}
          data-autofocus={isAutoFocused || undefined}
        >
          <Icon name="calendar" size="sm" className={styles.icon} />
          <span id={valueId} className={value ? styles.value : styles.placeholder}>
            {value ? formatFieldDate(value) : PLACEHOLDER}
          </span>
          <Icon name="chevronDown" size="sm" className={styles.chevron} />
        </button>
      </div>
      <Popover id={popoverId} panelRef={panelRef}>
        <Calendar value={value} min={min} isOpen={isOpen} onSelect={handleSelect} />
      </Popover>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export default memo(DateField)
