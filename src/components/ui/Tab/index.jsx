import { memo, useCallback } from 'react'
import { getToneClass } from '../../../utils/tones'
import styles from './Tab.module.css'

function Tab({ id = '', tabId = '', panelId = '', label = '', tone = 'lilac', isSelected = false, onSelect, onKeyDown } = {}) {
  const handleClick = useCallback(() => onSelect?.(id), [onSelect, id])

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={isSelected ? panelId : undefined}
      tabIndex={isSelected ? 0 : -1}
      className={`${styles.tab} ${getToneClass(tone)} textButton`}
      onClick={handleClick}
      onKeyDown={onKeyDown}
    >
      {label}
    </button>
  )
}

export default memo(Tab)
