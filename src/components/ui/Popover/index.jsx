import { memo } from 'react'
import styles from './Popover.module.css'

function Popover({ id = '', panelRef = null, children = null } = {}) {
  return (
    <div ref={panelRef} id={id} popover="auto" className={styles.popover}>
      {children}
    </div>
  )
}

export default memo(Popover)
