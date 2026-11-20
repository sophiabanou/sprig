import { memo, useCallback } from 'react'
import { useSlidingIndicator } from '../../../hooks/useSlidingIndicator'
import Fieldset from '../Fieldset'
import PillTrack from '../PillTrack'
import styles from './SegmentedControl.module.css'

const INDICATOR_OPTIONS = { itemSelector: '[data-toggle-option]', activeSelector: '[data-toggle-option]:has(input:checked)' }

function SegmentedControl({
  legend = '',
  isLegendHidden = false,
  describedBy,
  name = '',
  options = [],
  value = '',
  onChange,
} = {}) {
  const handleChange = useCallback((event) => onChange?.(event.target.value), [onChange])
  const { listRef, indicatorRef } = useSlidingIndicator(value, INDICATOR_OPTIONS)

  return (
    <Fieldset legend={legend} isLegendHidden={isLegendHidden} describedBy={describedBy}>
      <PillTrack trackRef={listRef} indicatorRef={indicatorRef} indicatorClassName={styles.indicator}>
        {options.map((option) => (
          <label key={option.value} className={`${styles.option} textButton`} data-toggle-option>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={handleChange}
              className={styles.input}
            />
            {option.label}
          </label>
        ))}
      </PillTrack>
    </Fieldset>
  )
}

export default memo(SegmentedControl)
