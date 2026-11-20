import { memo } from 'react'
import { ILLUSTRATIONS } from '../../../assets/icons/illustrations'
import styles from './Watermark.module.css'

const STROKE_WIDTH = 2

function Watermark({ name = 'logo', className = '' } = {}) {
  const layers = ILLUSTRATIONS[name] ?? []

  return (
    <svg
      className={`${styles.watermark} ${className}`}
      viewBox="0 0 48 48"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {layers.map((layer, layerIndex) => (
        <g key={layerIndex} className={styles[layer.kind]}>
          {[layer.d].flat().map((path) => (
            <path key={path} d={path} />
          ))}
        </g>
      ))}
    </svg>
  )
}

export default memo(Watermark)
