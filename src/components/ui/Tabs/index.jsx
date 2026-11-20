import { memo, useId, useMemo } from 'react'
import { getToneClass } from '../../../utils/tones'
import { usePanelReveal } from '../../../hooks/usePanelReveal'
import { useSlidingIndicator } from '../../../hooks/useSlidingIndicator'
import { useTabNavigation } from '../../../hooks/useTabNavigation'
import { useTabsEntrance } from '../../../hooks/useTabsEntrance'
import PillTrack from '../PillTrack'
import Tab from '../Tab'
import styles from './Tabs.module.css'

const INDICATOR_OPTIONS = { itemSelector: '[role="tab"]', activeSelector: '[aria-selected="true"]' }

/* Only the selected panel is rendered. Each tab is { id, label, tone }. */
function Tabs({ label = '', tabs = [], activeId = '', onChange, children = null } = {}) {
  const baseId = useId()
  const ids = useMemo(() => tabs.map((tab) => tab.id), [tabs])
  const handleKeyDown = useTabNavigation({ ids, activeId, onChange })
  const { listRef, indicatorRef } = useSlidingIndicator(activeId, INDICATOR_OPTIONS)
  const panelRef = usePanelReveal(activeId)
  const rootRef = useTabsEntrance()
  const activeTone = tabs.find((tab) => tab.id === activeId)?.tone ?? 'lilac'

  return (
    <div ref={rootRef} className={styles.tabs}>
      <PillTrack
        trackRef={listRef}
        indicatorRef={indicatorRef}
        indicatorClassName={`${styles.indicator} ${getToneClass(activeTone)}`}
        role="tablist"
        label={label}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            tabId={`${baseId}-tab-${tab.id}`}
            panelId={`${baseId}-panel-${tab.id}`}
            label={tab.label}
            tone={tab.tone}
            isSelected={tab.id === activeId}
            onSelect={onChange}
            onKeyDown={handleKeyDown}
          />
        ))}
      </PillTrack>
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

export default memo(Tabs)
