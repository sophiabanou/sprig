import { memo } from 'react'
import { useHeaderReveal } from '../../../hooks/useHeaderReveal'
import { getToneClass } from '../../../utils/tones'
import SplitText from '../../ui/SplitText'
import VisuallyHidden from '../../ui/VisuallyHidden'
import styles from './PageHeader.module.css'

function PageHeader({ lead = '', title = '', tone = 'lilac', description = '', headingRef = null, action = null } = {}) {
  const fullTitle = lead ? `${lead} ${title}` : title
  const headerRef = useHeaderReveal(fullTitle)

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.top}>
        <h1 ref={headingRef} className={`${styles.title} textDisplay`} tabIndex={-1}>
          <VisuallyHidden>{fullTitle}</VisuallyHidden>
          <span className={styles.visual}>
            {lead && <SplitText text={lead} className="textDisplayLight" />}
            <SplitText text={title} className={`${styles.accent} ${getToneClass(tone)}`} />
          </span>
        </h1>
        {action && (
          <div className={styles.action} data-reveal="action">
            {action}
          </div>
        )}
      </div>
      {description && <p className={`${styles.description} textSubtitle`} data-reveal="subtitle">{description}</p>}
    </header>
  )
}

export default memo(PageHeader)
