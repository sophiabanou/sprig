import { memo, useCallback, useId } from 'react'
import Icon from '../Icon'
import VisuallyHidden from '../VisuallyHidden'
import styles from './SearchField.module.css'

/* A search box whose visible placeholder is also its label. Esc clears it. */
function SearchField({ label = 'Search', value = '', onChange } = {}) {
  const id = useId()

  const handleChange = useCallback((event) => onChange?.(event.target.value), [onChange])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Escape' || !value) return
      event.preventDefault()
      onChange?.('')
    },
    [value, onChange],
  )

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        <VisuallyHidden>{label}</VisuallyHidden>
      </label>
      <span className={styles.icon}>
        <Icon name="search" size="sm" />
      </span>
      <input
        id={id}
        type="search"
        className={`${styles.input} textBody`}
        placeholder={label}
        value={value}
        autoComplete="off"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default memo(SearchField)
