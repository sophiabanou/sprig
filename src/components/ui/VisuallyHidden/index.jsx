import { memo } from 'react'
import styles from './VisuallyHidden.module.css'

function VisuallyHidden({ role, children = null } = {}) {
  return (
    <span role={role} className={styles.visuallyHidden}>
      {children}
    </span>
  )
}

export default memo(VisuallyHidden)
