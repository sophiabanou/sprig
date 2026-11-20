import { memo, useCallback, useId, useRef } from 'react'
import FieldError from '../FieldError'
import styles from './TextField.module.css'

const MULTILINE_ROWS = 3

function TextField({
  label = '',
  value = '',
  onChange,
  type = 'text',
  error = '',
  isRequired = false,
  isOptional = false,
  isMultiline = false,
  isAutoFocused = false,
} = {}) {
  const id = useId()
  const textareaRef = useRef(null)
  const errorId = `${id}error`
  const sharedProps = {
    id,
    value,
    onChange,
    required: isRequired,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    'data-autofocus': isAutoFocused || undefined,
  }

  /* A press on the box's own padding still lands in the text */
  const handleBoxPointerDown = useCallback((event) => {
    if (event.target !== event.currentTarget) return
    event.preventDefault()
    textareaRef.current?.focus()
  }, [])

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={`${styles.label} textLabel`}>
        {label}
        {isOptional && <span className={`${styles.optional} textCaption`}>Optional</span>}
      </label>
      {isMultiline ? (
        <div className={`${styles.input} ${styles.multiline}`} onPointerDown={handleBoxPointerDown}>
          <textarea {...sharedProps} ref={textareaRef} rows={MULTILINE_ROWS} className={`${styles.textarea} textBody`} />
        </div>
      ) : (
        <input {...sharedProps} type={type} className={`${styles.input} textBody`} />
      )}
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export default memo(TextField)
