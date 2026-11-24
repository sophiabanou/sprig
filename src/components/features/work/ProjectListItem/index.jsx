import { memo, useCallback } from 'react'
import { getToneClass } from '../../../../utils/tones'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import styles from './ProjectListItem.module.css'

function ProjectListItem({ project = {}, isSelected = false, onSelect } = {}) {
  const { id = '', name = '', tone = 'rose', openCount = 0 } = project

  const handleClick = useCallback(() => onSelect?.(project), [project, onSelect])

  return (
    <li>
      <button
        type="button"
        className={`${styles.item} ${getToneClass(tone)}`}
        data-project-id={id}
        aria-current={isSelected ? 'true' : undefined}
        onClick={handleClick}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span className={`${styles.name} textButton`}>{name}</span>
        {openCount > 0 && (
          <span className={`${styles.count} textCaption`}>
            {openCount}
            <VisuallyHidden>{openCount === 1 ? ' open task' : ' open tasks'}</VisuallyHidden>
          </span>
        )}
      </button>
    </li>
  )
}

export default memo(ProjectListItem)
