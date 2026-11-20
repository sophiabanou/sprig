import { memo } from 'react'
import { useCountTag } from '../../../hooks/useCountTag'
import Confetti from '../Confetti'
import Icon from '../Icon'
import styles from './CountTag.module.css'

function CountTag({ label = '', isComplete = false } = {}) {
  const tagRef = useCountTag(label)

  return (
    <span className={styles.wrapper}>
      <span ref={tagRef} className={`${styles.tag} textTag`}>
        {isComplete && <Icon name="check" size="sm" />}
        {label}
      </span>
      <Confetti isActive={isComplete} />
    </span>
  )
}

export default memo(CountTag)
