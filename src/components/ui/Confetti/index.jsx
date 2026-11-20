import { memo } from 'react'
import { useConfettiBurst } from '../../../hooks/useConfettiBurst'
import { getToneClass } from '../../../utils/tones'
import styles from './Confetti.module.css'

const CONFETTI_TONES = ['lilac', 'mint', 'peach', 'lemon', 'sky', 'rose']
const CONFETTI_SHAPES = ['dot', 'strip', 'square']
const CONFETTI_COUNT = 18

const PIECES = Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
  tone: CONFETTI_TONES[index % CONFETTI_TONES.length],
  shape: CONFETTI_SHAPES[index % CONFETTI_SHAPES.length],
}))

function Confetti({ isActive = false } = {}) {
  const confettiRef = useConfettiBurst(isActive)

  return (
    <span ref={confettiRef} className={styles.confetti} aria-hidden="true">
      {PIECES.map((piece, index) => (
        <span
          key={index}
          className={`${styles.piece} ${styles[piece.shape] ?? ''} ${getToneClass(piece.tone)}`}
          data-confetti
        />
      ))}
    </span>
  )
}

export default memo(Confetti)
