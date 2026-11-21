import { memo } from 'react'
import CountTag from '../CountTag'
import Illustration from '../Illustration'
import styles from './ListHeader.module.css'

/* The heading above a list: an illustration, the title and a count tag */
function ListHeader({ id = '', title = '', illustration = '', meta = '', isComplete = false } = {}) {
  return (
    <div className={styles.header} data-reveal="list-heading">
      {illustration && <Illustration name={illustration} />}
      <h2 id={id} className="textHeadingBold">
        {title}
      </h2>
      {meta && (
        <span key={title} className={styles.meta}>
          <CountTag label={meta} isComplete={isComplete} />
        </span>
      )}
    </div>
  )
}

export default memo(ListHeader)
