import { memo } from 'react'
import styles from './PillTrack.module.css'

/* The bordered pill that holds tabs or toggle options. The indicator slides behind the selected item. */
function PillTrack({ trackRef = null, indicatorRef = null, indicatorClassName = '', role, label, children = null } = {}) {
  return (
    <div ref={trackRef} role={role} aria-label={label} className={styles.track}>
      {children}
      <span ref={indicatorRef} className={`${styles.indicator} ${indicatorClassName}`} data-pill-indicator aria-hidden="true" />
    </div>
  )
}

export default memo(PillTrack)
