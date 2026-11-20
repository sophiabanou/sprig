import { memo } from 'react'
import { WORDMARK } from '../../../assets/icons/wordmark'
import styles from './Wordmark.module.css'

function Wordmark({ className = '' } = {}) {
  return (
    <svg
      className={`${styles.wordmark} ${className}`}
      viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={WORDMARK.d} />
    </svg>
  )
}

export default memo(Wordmark)
