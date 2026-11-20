import { memo, useId } from 'react'
import { useNumberField } from '../../../hooks/useNumberField'
import FieldError from '../FieldError'
import IconButton from '../IconButton'
import styles from './NumberField.module.css'

function NumberField({ label = '', value = '', onChange, min = 0, max = 99, hint = '', error = '', isRequired = false } = {}) {
  const id = useId()
  const hintId = `${id}hint`
  const errorId = `${id}error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')
  const { isAtMin, isAtMax, handleDecrease, handleIncrease, handleInputChange } = useNumberField({
    value,
    min,
    max,
    onChange,
  })

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={`${styles.label} textLabel`}>
        {label}
      </label>
      <div className={styles.control}>
        <div className={styles.stepper}>
          <IconButton label={`Decrease ${label.toLowerCase()}`} icon="minus" size="sm" hasLift={false} onClick={handleDecrease} isDisabled={isAtMin} />
          <input
            id={id}
            type="number"
            inputMode="numeric"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            required={isRequired}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={`${styles.input} textBody`}
          />
          <IconButton label={`Increase ${label.toLowerCase()}`} icon="plus" size="sm" hasLift={false} onClick={handleIncrease} isDisabled={isAtMax} />
        </div>
        {hint && (
          <span id={hintId} className={`${styles.hint} textCaption`}>
            {hint}
          </span>
        )}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export default memo(NumberField)
