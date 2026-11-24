import { memo, useCallback, useId, useState } from 'react'
import FieldReveal from '../../../ui/FieldReveal'
import Icon from '../../../ui/Icon'
import ProjectListItem from '../ProjectListItem'
import styles from './ProjectArchive.module.css'

/* Archived projects, folded away under a toggle. A search with archived matches unfolds them. */
function ProjectArchive({ projects = [], selectedId = null, isSearching = false, onSelect } = {}) {
  const listId = useId()
  const [isExpanded, setIsExpanded] = useState(false)
  const isShown = isExpanded || isSearching

  const handleToggle = useCallback(() => setIsExpanded((value) => !value), [])

  if (projects.length === 0) return null

  return (
    <div className={styles.archive}>
      <button
        type="button"
        className={`${styles.toggle} textLabel`}
        aria-expanded={isShown}
        aria-controls={listId}
        onClick={handleToggle}
      >
        <Icon name={isShown ? 'chevronDown' : 'chevronRight'} size="sm" />
        <span className={styles.label}>Archived</span>
        <span className={styles.count}>{projects.length}</span>
      </button>
      <FieldReveal isVisible={isShown}>
        <ul id={listId} className={styles.list} aria-label="Archived projects">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} isSelected={project.id === selectedId} onSelect={onSelect} />
          ))}
        </ul>
      </FieldReveal>
    </div>
  )
}

export default memo(ProjectArchive)
