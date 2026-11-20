import { memo } from 'react'
import Icon from '../Icon'
import styles from './Checkbox.module.css'

function Checkbox({ id = '', isChecked = false, onChange, describedBy } = {}) {
  return (
    <span className={styles.wrapper}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        aria-describedby={describedBy}
        className={styles.input}
      />
      <Icon name="check" size="sm" className={styles.check} />
    </span>
  )
}

export default memo(Checkbox)
