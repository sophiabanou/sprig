import { memo } from 'react'
import Sidebar from '../Sidebar'
import styles from './AppShell.module.css'

/* A full height page fills the window and scrolls inside its own panes instead of scrolling the page */
function AppShell({ route = '', mainRef = null, isFullHeight = false, children = null } = {}) {
  return (
    <div className={`${styles.shell} ${isFullHeight ? styles.fullHeight : ''}`}>
      <Sidebar route={route} />
      <main ref={mainRef} className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}

export default memo(AppShell)
