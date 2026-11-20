import { memo, useCallback } from 'react'
import { useLiftHover } from '../../../hooks/useLiftHover'
import Icon from '../Icon'
import styles from './IconButton.module.css'

/* Uses aria-disabled instead of disabled so focus stays on the button when it becomes unavailable. */
function IconButton({ label = '', icon = '', size = 'md', hasLift = true, onClick, isDisabled = false } = {}) {
  const { buttonRef, faceRef, shadowRef } = useLiftHover(isDisabled || !hasLift)

  const handleClick = useCallback(() => {
    if (!isDisabled) onClick?.()
  }, [isDisabled, onClick])

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.button} ${styles[size]} ${hasLift ? '' : styles.flat}`}
      aria-label={label}
      aria-disabled={isDisabled}
      onClick={handleClick}
    >
      <span ref={shadowRef} className={styles.shadow} aria-hidden="true" />
      <span ref={faceRef} className={styles.face}>
        <Icon name={icon} size="sm" />
      </span>
    </button>
  )
}

export default memo(IconButton)
