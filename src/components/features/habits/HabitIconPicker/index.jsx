import { memo, useCallback, useId } from 'react'
import { HABIT_ICON_COLORS, HABIT_ICONS } from '../../../../store/useHabitStore'
import { useChangePop } from '../../../../hooks/useChangePop'
import { usePopover } from '../../../../hooks/usePopover'
import { getToneClass } from '../../../../utils/tones'
import Button from '../../../ui/Button'
import Icon from '../../../ui/Icon'
import Popover from '../../../ui/Popover'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import styles from './HabitIconPicker.module.css'

const ICON_LABELS = {
  leaf: 'Leaf',
  sprout: 'Sprout',
  toothbrush: 'Toothbrush',
  droplet: 'Water drop',
  coffee: 'Coffee',
  apple: 'Apple',
  pill: 'Pill',
  bed: 'Bed',
  moon: 'Moon',
  sun: 'Sun',
  dumbbell: 'Dumbbell',
  bike: 'Bike',
  heart: 'Heart',
  book: 'Book',
  pencil: 'Pencil',
  chat: 'Chat',
  film: 'Film',
  music: 'Music',
  camera: 'Camera',
  gamepad: 'Game controller',
  phone: 'Phone',
  broom: 'Broom',
  cat: 'Cat',
  star: 'Star',
}

/* A pointer pick closes the popover. Arrow keys only move the choice, and Enter confirms it. */
function HabitIconPicker({ value = HABIT_ICONS[0], color = '', onChange } = {}) {
  const name = useId()
  const popoverId = useId()
  const currentId = useId()
  const { anchorRef, panelRef, close } = usePopover()
  const currentIconRef = useChangePop(value)

  const handleChange = useCallback((event) => onChange?.(event.target.value), [onChange])

  const handleClick = useCallback(
    (event) => {
      if (event.detail > 0) close()
    },
    [close],
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      close()
    },
    [close],
  )

  return (
    <div className={styles.field}>
      <span className={`${styles.label} textLabel`} aria-hidden="true">
        Icon
      </span>
      <div ref={anchorRef} className={`${styles.anchor} ${getToneClass(color || HABIT_ICON_COLORS[value])}`}>
        <Button variant="secondary" hasLift={false} popoverTarget={popoverId} ariaDescribedBy={currentId}>
          <span ref={currentIconRef} className={styles.current}>
            <Icon name={value} />
          </span>
          Choose icon
          <Icon name="chevronDown" size="sm" />
        </Button>
        <span id={currentId} hidden>
          {ICON_LABELS[value]}
        </span>
      </div>
      <Popover id={popoverId} panelRef={panelRef}>
        <fieldset className={styles.fieldset}>
          <legend>
            <VisuallyHidden>Icon</VisuallyHidden>
          </legend>
          <div className={styles.options}>
            {HABIT_ICONS.map((icon) => (
              <label
                key={icon}
                className={`${styles.option} ${getToneClass(icon === value && color ? color : HABIT_ICON_COLORS[icon])}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={icon}
                  checked={icon === value}
                  onChange={handleChange}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  data-popover-focus={icon === value || undefined}
                  className={styles.input}
                />
                <span className={styles.tile}>
                  <Icon name={icon} />
                </span>
                <VisuallyHidden>{ICON_LABELS[icon]}</VisuallyHidden>
              </label>
            ))}
          </div>
        </fieldset>
      </Popover>
    </div>
  )
}

export default memo(HabitIconPicker)
