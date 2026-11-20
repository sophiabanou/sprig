import { memo } from 'react'
import { useLiftHover } from '../../../hooks/useLiftHover'
import styles from './Button.module.css'

function Button({
  children = null,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  popoverTarget,
  ariaDescribedBy,
  hasLift = true,
  className = '',
} = {}) {
  const { buttonRef, faceRef, shadowRef } = useLiftHover(!hasLift)

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${hasLift ? '' : styles.flat} textButton ${className}`}
      onClick={onClick}
      popoverTarget={popoverTarget}
      aria-describedby={ariaDescribedBy}
    >
      <span ref={shadowRef} className={styles.shadow} aria-hidden="true" />
      <span ref={faceRef} className={styles.face}>
        {children}
      </span>
    </button>
  )
}

export default memo(Button)
