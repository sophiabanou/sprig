import { memo } from 'react'
import Sidebar from '../Sidebar'
import styles from './AppShell.module.css'

function AppShell({ route = '', mainRef = null, children = null } = {}) {
  return (
    <div className={styles.shell}>
      <Sidebar route={route} />
      <main ref={mainRef} className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}

export default memo(AppShell)
