import { memo, useMemo } from 'react'
import styles from './SplitText.module.css'

/* Renders each letter in its own span so it can be animated. Hidden from assistive tech, so the parent must provide the readable text. */
function SplitText({ text = '', className = '' } = {}) {
  const words = useMemo(() => text.split(' ').map((word) => Array.from(word)), [text])

  return (
    <span className={className} aria-hidden="true">
      {words.map((letters, wordIndex) => (
        <span key={wordIndex}>
          {wordIndex > 0 && ' '}
          <span className={styles.word}>
            {letters.map((letter, letterIndex) => (
              <span key={letterIndex} className={styles.letter} data-reveal="letter">
                {letter}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

export default memo(SplitText)
