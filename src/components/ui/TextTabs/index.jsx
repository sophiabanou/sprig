import { memo, useCallback, useId, useMemo } from 'react'
import { useTabNavigation } from '../../../hooks/useTabNavigation'
import styles from './TextTabs.module.css'

/*
  Quiet tabs: plain text with a line under the selected one. Each tab is { id, label }. Only the selected panel is rendered.
  With isFilling, the panel takes the rest of the height, for content that scrolls inside itself.
  panelRef reaches the panel, for animating its content as it changes.
*/
function TextTabs({
  label = '',
  tabs = [],
  activeId = '',
  aside = null,
  isFilling = false,
  panelRef = null,
  onChange,
  children = null,
} = {}) {
  const baseId = useId()
  const ids = useMemo(() => tabs.map((tab) => tab.id), [tabs])
  const handleKeyDown = useTabNavigation({ ids, activeId, onChange })
  const handleClick = useCallback((event) => onChange?.(event.currentTarget.dataset.tabId), [onChange])

  return (
    <div className={`${styles.tabs} ${isFilling ? styles.filling : ''}`}>
      <div className={styles.bar}>
        <div role="tablist" aria-label={label} className={styles.list}>
          {tabs.map((tab) => {
            const isSelected = tab.id === activeId
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={isSelected ? `${baseId}-panel-${tab.id}` : undefined}
                tabIndex={isSelected ? 0 : -1}
                data-tab-id={tab.id}
                className={`${styles.tab} textButton`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        {aside}
      </div>
      <div
        ref={panelRef}
        role="tabpanel"
        id={`${baseId}-panel-${activeId}`}
        aria-labelledby={`${baseId}-tab-${activeId}`}
        tabIndex={0}
        className={styles.panel}
      >
        {children}
      </div>
    </div>
  )
}

export default memo(TextTabs)
