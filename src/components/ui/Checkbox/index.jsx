import { memo, useCallback } from 'react'
import { useCheckPop } from '../../../hooks/useCheckPop'
import { usePressSquish } from '../../../hooks/usePressSquish'
import Icon from '../Icon'
import styles from './Checkbox.module.css'

function Checkbox({ id = '', isChecked = false, onChange, describedBy } = {}) {
  const { buttonRef, targetRef } = usePressSquish()
  const popRef = useCheckPop(isChecked)

  const setBoxRef = useCallback(
    (element) => {
      targetRef.current = element
      popRef.current = element
    },
    [targetRef, popRef],
  )

  return (
    <span ref={setBoxRef} className={styles.box}>
      <input
        ref={buttonRef}
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        aria-describedby={describedBy}
        className={styles.input}
      />
      <span className={styles.fill} data-check-fill aria-hidden="true" />
      <span className={styles.check} data-check-mark>
        <Icon name="check" size="sm" />
      </span>
    </span>
  )
}

export default memo(Checkbox)
