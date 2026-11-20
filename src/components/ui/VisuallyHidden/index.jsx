import { memo } from 'react'
import styles from './VisuallyHidden.module.css'

function VisuallyHidden({ children = null } = {}) {
  return <span className={styles.visuallyHidden}>{children}</span>
}

export default memo(VisuallyHidden)
