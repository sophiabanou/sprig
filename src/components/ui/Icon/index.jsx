import { memo } from 'react'
import { ICONS } from '../../../assets/icons/icons'
import styles from './Icon.module.css'

const STROKE_WIDTH = 2

function Icon({ name = '', size = 'md', className = '' } = {}) {
  const layers = ICONS[name] ?? []

  return (
    <svg
      className={`${styles.icon} ${styles[size]} ${className}`}
      viewBox="0 0 24 24"
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

export default memo(Icon)
