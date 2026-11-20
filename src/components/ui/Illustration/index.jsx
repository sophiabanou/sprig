import { memo } from 'react'
import { getToneClass } from '../../../utils/tones'
import { ILLUSTRATIONS } from '../../../assets/icons/illustrations'
import { useIllustrationLoop } from '../../../hooks/useIllustrationLoop'
import styles from './Illustration.module.css'

const STROKE_WIDTH = 2

function Illustration({ name = '', className = '' } = {}) {
  const illustrationRef = useIllustrationLoop(name)
  const layers = ILLUSTRATIONS[name] ?? []

  return (
    <svg
      ref={illustrationRef}
      className={`${styles.illustration} ${className}`}
      viewBox="0 0 48 48"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {layers.map((layer, layerIndex) => (
        <g
          key={layerIndex}
          className={`${styles[layer.kind]} ${layer.tone ? getToneClass(layer.tone) : ''}`}
          data-motion={layer.motion}
        >
          {[layer.d].flat().map((path) => (
            <path key={path} d={path} />
          ))}
        </g>
      ))}
    </svg>
  )
}

export default memo(Illustration)
