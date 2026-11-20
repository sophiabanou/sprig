import { memo } from 'react'
import { useFadePresence } from '../../../../hooks/useFadePresence'
import styles from './HabitUndoButton.module.css'

function HabitUndoButton({ name = '', isVisible = true, onClick } = {}) {
  const { elementRef, isRendered, isLeaving } = useFadePresence(isVisible)

  if (!isRendered) return null

  return (
    <button
      ref={elementRef}
      type="button"
      className={`${styles.undo} textLabel`}
      aria-label={`Undo ${name}`}
      inert={isLeaving}
      onClick={onClick}
    >
      Undo
    </button>
  )
}

export default memo(HabitUndoButton)
