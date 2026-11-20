import { memo } from 'react'
import styles from './Fieldset.module.css'

function Fieldset({ legend = '', children = null } = {}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={`${styles.legend} textLabel`}>{legend}</legend>
      {children}
    </fieldset>
  )
}

export default memo(Fieldset)
