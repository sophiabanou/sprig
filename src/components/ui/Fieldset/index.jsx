import { memo } from 'react'
import VisuallyHidden from '../VisuallyHidden'
import styles from './Fieldset.module.css'

/* A hidden legend still names the group, for when a visible title nearby already says the same */
function Fieldset({ legend = '', isLegendHidden = false, describedBy, children = null } = {}) {
  return (
    <fieldset className={styles.fieldset} aria-describedby={describedBy}>
      {isLegendHidden ? (
        <legend className={styles.hiddenLegend}>
          <VisuallyHidden>{legend}</VisuallyHidden>
        </legend>
      ) : (
        <legend className={`${styles.legend} textLabel`}>{legend}</legend>
      )}
      {children}
    </fieldset>
  )
}

export default memo(Fieldset)
