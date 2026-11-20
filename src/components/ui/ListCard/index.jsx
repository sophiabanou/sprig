import { Children, memo, useId, useMemo } from 'react'
import { useCompleteAnnouncement } from '../../../hooks/useCompleteAnnouncement'
import { useEmptyEntrance } from '../../../hooks/useEmptyEntrance'
import { useListEntrance } from '../../../hooks/useListEntrance'
import { getToneClass } from '../../../utils/tones'
import CountTag from '../CountTag'
import Illustration from '../Illustration'
import Watermark from '../Watermark'
import styles from './ListCard.module.css'

function ListCard({
  title = '',
  illustration = '',
  meta = '',
  isComplete = false,
  tone = 'lilac',
  emptyTitle = '',
  emptyText = '',
  isEmpty = false,
  children = null,
} = {}) {
  const headingId = useId()
  useCompleteAnnouncement(title, isComplete)
  const keys = useMemo(() => Children.toArray(children).map((child) => String(child.key)), [children])
  const listRef = useListEntrance(keys, title)
  const bodyRef = useEmptyEntrance(isEmpty, title)

  return (
    <section className={`${styles.section} ${getToneClass(tone)}`} aria-labelledby={headingId}>
      <div className={styles.header} data-reveal="list-heading">
        {illustration && <Illustration name={illustration} />}
        <h2 id={headingId} className="textHeadingBold">
          {title}
        </h2>
        {meta && (
          <span key={title} className={styles.meta}>
            <CountTag label={meta} isComplete={isComplete} />
          </span>
        )}
      </div>
      <div ref={bodyRef} className={isEmpty ? styles.card : undefined} data-reveal="list-body">
        {isEmpty ? (
          <div className={styles.empty}>
            <div className={styles.emptyCopy}>
              {emptyTitle && <p className={`${styles.emptyTitle} textHeading`}>{emptyTitle}</p>}
              <p className={`${styles.emptyText} textBody`}>{emptyText}</p>
            </div>
            <Watermark className={styles.watermark} />
          </div>
        ) : (
          <ul ref={listRef} className={styles.list}>
            {children}
          </ul>
        )}
      </div>
    </section>
  )
}

export default memo(ListCard)
