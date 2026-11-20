import { memo } from 'react'
import Illustration from '../../ui/Illustration'
import VisuallyHidden from '../../ui/VisuallyHidden'
import Wordmark from '../../ui/Wordmark'
import styles from './Brand.module.css'

function Brand({ name = 'Sprig' } = {}) {
  return (
    <p className={styles.brand}>
      <Illustration name="logo" className={styles.logo} />
      <Wordmark className={styles.wordmark} />
      <VisuallyHidden>{name}</VisuallyHidden>
    </p>
  )
}

export default memo(Brand)
