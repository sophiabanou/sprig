import { memo } from 'react'
import { useAnnouncerStore } from '../../../store/useAnnouncerStore'
import styles from './LiveRegion.module.css'

function LiveRegion() {
  const message = useAnnouncerStore((state) => state.message)

  return (
    <div className={styles.visuallyHidden} role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default memo(LiveRegion)
