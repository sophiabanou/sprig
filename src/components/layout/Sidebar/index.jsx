import { memo } from 'react'
import { ROUTES } from '../../../hooks/useRoute'
import { usePreviousValue } from '../../../hooks/usePreviousValue'
import { useSlidingIndicator } from '../../../hooks/useSlidingIndicator'
import { getToneClass } from '../../../utils/tones'
import Brand from '../Brand'
import SidebarLink from '../SidebarLink'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { route: ROUTES.HABITS, label: 'Habits', tone: 'peach' },
  { route: ROUTES.TASKS, label: 'Tasks', tone: 'sky' },
  { route: ROUTES.NOTES, label: 'Notes', tone: 'lemon' },
  { route: ROUTES.WORK, label: 'Work', tone: 'rose' },
]

const SECONDARY_ITEMS = [{ route: ROUTES.SETTINGS, label: 'Settings', tone: 'lilac', icon: 'sliders' }]

const INDICATOR_OPTIONS = {
  itemSelector: '[data-indicator-list] a',
  activeSelector: '[data-indicator-list] [aria-current="page"]',
}

function Sidebar({ route = ROUTES.HABITS } = {}) {
  const { listRef, indicatorRef } = useSlidingIndicator(route, INDICATOR_OPTIONS)
  const previousRoute = usePreviousValue(route)
  const activeTone = NAV_ITEMS.find((item) => item.route === route)?.tone ?? 'lilac'
  const previousTone = NAV_ITEMS.find((item) => item.route === previousRoute)?.tone ?? activeTone

  return (
    <aside className={styles.sidebar}>
      <Brand />
      <nav ref={listRef} aria-label="Main" className={styles.nav}>
        <ul className={styles.list} data-indicator-list>
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.route} {...item} isActive={item.route === route} />
          ))}
        </ul>
        <ul className={`${styles.list} ${styles.secondary}`}>
          {SECONDARY_ITEMS.map((item) => (
            <SidebarLink key={item.route} {...item} isActive={item.route === route} />
          ))}
        </ul>
        <span ref={indicatorRef} className={`${styles.indicator} ${getToneClass(activeTone)}`} aria-hidden="true">
          <span className={`${styles.indicatorFade} ${getToneClass(previousTone)}`} data-indicator-fade />
        </span>
      </nav>
    </aside>
  )
}

export default memo(Sidebar)
