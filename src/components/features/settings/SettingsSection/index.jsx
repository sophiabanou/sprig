import { memo, useId } from 'react'
import styles from './SettingsSection.module.css'

function SettingsSection({ title = '', children = null } = {}) {
  const headingId = useId()

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div data-reveal="list-heading">
        <h2 id={headingId} className="textHeadingBold">
          {title}
        </h2>
      </div>
      <div data-reveal="list-body">{children}</div>
    </section>
  )
}

export default memo(SettingsSection)
