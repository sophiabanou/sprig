import { memo, useCallback, useId } from 'react'
import { HABIT_COLORS } from '../../../../store/useHabitStore'
import { useChangePop } from '../../../../hooks/useChangePop'
import { getToneClass } from '../../../../utils/tones'
import Fieldset from '../../../ui/Fieldset'
import Icon from '../../../ui/Icon'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import styles from './HabitColorPicker.module.css'

const COLOR_LABELS = {
  lilac: 'Lilac',
  mint: 'Mint',
  peach: 'Peach',
  lemon: 'Lemon',
  sky: 'Sky',
  rose: 'Rose',
}

function HabitColorPicker({ value = HABIT_COLORS[0], onChange } = {}) {
  const name = useId()
  const checkRef = useChangePop(value)
  const handleChange = useCallback((event) => onChange?.(event.target.value), [onChange])

  return (
    <Fieldset legend="Color">
      <div className={styles.options}>
        {HABIT_COLORS.map((color) => (
          <label key={color} className={`${styles.option} ${getToneClass(color)}`}>
            <input
              type="radio"
              name={name}
              value={color}
              checked={color === value}
              onChange={handleChange}
              className={styles.input}
            />
            <span className={styles.swatch}>
              {color === value && (
                <span ref={checkRef} className={styles.check}>
                  <Icon name="check" size="sm" />
                </span>
              )}
            </span>
            <VisuallyHidden>{COLOR_LABELS[color]}</VisuallyHidden>
          </label>
        ))}
      </div>
    </Fieldset>
  )
}

export default memo(HabitColorPicker)
