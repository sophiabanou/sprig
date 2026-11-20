import { memo } from 'react'
import { useLastValue } from '../../../hooks/useLastValue'
import FieldReveal from '../FieldReveal'
import Icon from '../Icon'
import styles from './FieldError.module.css'

function FieldError({ id = '', message = '' } = {}) {
  const shownMessage = useLastValue(message)

  return (
    <FieldReveal isVisible={Boolean(message)}>
      <p id={id} className={`${styles.error} textCaption`}>
        <Icon name="alert" size="sm" className={styles.icon} />
        {shownMessage}
      </p>
    </FieldReveal>
  )
}

export default memo(FieldError)
