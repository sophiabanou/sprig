import { memo } from 'react'
import { useTypewriter } from '../../../hooks/useTypewriter'
import VisuallyHidden from '../VisuallyHidden'
import styles from './TypewriterText.module.css'

/*
  Text made of parts that retypes the parts that change. parts must be stable, for example a constant.
  Assistive tech reads the plain copy at once.
  A hidden copy of the full text holds the space, so the layout does not jump while letters come and go.
*/
function TypewriterText({ parts = [], delay = 0, speed = 1 } = {}) {
  const text = parts.join('')
  const textRef = useTypewriter(parts, { delay, speed })

  return (
    <span>
      <VisuallyHidden>{text}</VisuallyHidden>
      <span className={styles.stack} aria-hidden="true">
        <span className={styles.ghost}>{text}</span>
        <span ref={textRef} className={styles.typed} />
      </span>
    </span>
  )
}

export default memo(TypewriterText)
