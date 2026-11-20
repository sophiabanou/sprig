import { memo } from 'react'
import { getToneClass } from '../../../utils/tones'
import Icon from '../../ui/Icon'
import styles from './SidebarLink.module.css'

function SidebarLink({ route = '', label = '', tone = 'lilac', icon = '', isActive = false } = {}) {
  return (
    <li>
      <a
        href={`#/${route}`}
        className={`${styles.link} ${getToneClass(tone)} textButton`}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon && <Icon name={icon} size="sm" />}
        {label}
      </a>
    </li>
  )
}

export default memo(SidebarLink)
