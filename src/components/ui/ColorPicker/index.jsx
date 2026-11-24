import { memo, useCallback, useId } from 'react'
import { useChangePop } from '../../../hooks/useChangePop'
import { getToneClass, TONE_LABELS, TONES } from '../../../utils/tones'
import Fieldset from '../Fieldset'
import Icon from '../Icon'
import VisuallyHidden from '../VisuallyHidden'
import styles from './ColorPicker.module.css'

function ColorPicker({ value = TONES[0], onChange } = {}) {
  const name = useId()
  const checkRef = useChangePop(value)
  const handleChange = useCallback((event) => onChange?.(event.target.value), [onChange])

  return (
    <Fieldset legend="Color">
      <div className={styles.options}>
        {TONES.map((color) => (
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
            <VisuallyHidden>{TONE_LABELS[color]}</VisuallyHidden>
          </label>
        ))}
      </div>
    </Fieldset>
  )
}

export default memo(ColorPicker)
