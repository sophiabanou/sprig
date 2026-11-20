import { memo } from 'react'
import { useFieldReveal } from '../../../hooks/useFieldReveal'
import styles from './FieldReveal.module.css'

function FieldReveal({ isVisible = true, children = null } = {}) {
  const { revealRef, isRendered, isLeaving } = useFieldReveal(isVisible)

  if (!isRendered) return null

  return (
    <div ref={revealRef} className={styles.reveal} inert={isLeaving}>
      {children}
    </div>
  )
}

export default memo(FieldReveal)
