import { memo } from 'react'
import { useFadePresence } from '../../../../hooks/useFadePresence'
import Icon from '../../../ui/Icon'
import styles from './HabitPillButton.module.css'

/*
  A small pill in the progress line, so logging and undoing stay next to the count they change.
  With shouldKeepSpace, a hidden copy holds its place once it is gone, so the pills after it never shift.
*/
function HabitPillButton({
  text = '',
  name = '',
  icon = '',
  kind = '',
  isVisible = true,
  shouldKeepSpace = false,
  describedBy,
  onClick,
} = {}) {
  const { elementRef, isRendered, isLeaving } = useFadePresence(isVisible)
  const content = (
    <>
      {icon && <Icon name={icon} size="sm" />}
      {text}
    </>
  )

  if (!isRendered) {
    if (!shouldKeepSpace) return null
    return (
      <span className={`${styles.pill} ${styles.placeholder} textLabel`} aria-hidden="true">
        {content}
      </span>
    )
  }

  return (
    <button
      ref={elementRef}
      type="button"
      className={`${styles.pill} textLabel`}
      aria-label={`${text} ${name}`}
      aria-describedby={describedBy}
      data-habit-pill={kind}
      inert={isLeaving}
      onClick={onClick}
    >
      {content}
    </button>
  )
}

export default memo(HabitPillButton)
