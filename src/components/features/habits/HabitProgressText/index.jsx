import { memo } from 'react'
import { useTextSwap } from '../../../../hooks/useTextSwap'
import Icon from '../../../ui/Icon'
import styles from './HabitProgressText.module.css'

/*
  The count and the done text share one grid cell and swap with motion. A hidden copy of the widest count
  sits in the same cell, so the line keeps one width as the count changes and anything after it stays put.
*/
function HabitProgressText({ id = '', count = 0, target = 1, periodText = '', isComplete = false } = {}) {
  const { offRef, onRef } = useTextSwap(isComplete)

  return (
    <span className={`${styles.slot} textCaption`}>
      <span ref={offRef} id={isComplete ? undefined : id} className={styles.text} aria-hidden={isComplete}>
        {`${count} of ${target} ${periodText}`}
      </span>
      <span
        ref={onRef}
        id={isComplete ? id : undefined}
        className={`${styles.text} ${styles.complete}`}
        aria-hidden={!isComplete}
      >
        <Icon name="check" size="sm" />
        {`Done ${periodText}`}
      </span>
      <span className={`${styles.text} ${styles.sizer}`} aria-hidden="true">
        {`${target} of ${target} ${periodText}`}
      </span>
    </span>
  )
}

export default memo(HabitProgressText)
