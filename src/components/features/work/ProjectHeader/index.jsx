import { memo, useCallback } from 'react'
import Button from '../../../ui/Button'
import Icon from '../../../ui/Icon'
import IconButton from '../../../ui/IconButton'
import styles from './ProjectHeader.module.css'

/* The project name with its actions. An archived project only offers Restore. */
function ProjectHeader({
  project = {},
  headingRef = null,
  addLabel = '',
  onBack,
  onAdd,
  onEdit,
  onArchive,
  onRestore,
} = {}) {
  const { name = '', isArchived = false } = project

  const handleEdit = useCallback(() => onEdit?.(project), [project, onEdit])
  const handleArchive = useCallback(() => onArchive?.(project), [project, onArchive])

  /* The Restore button leaves with the archived state, so focus moves to the project name */
  const handleRestore = useCallback(() => {
    onRestore?.(project)
    headingRef?.current?.focus()
  }, [project, headingRef, onRestore])

  return (
    <div className={styles.header}>
      <span className={styles.back}>
        <IconButton label="Back to projects" icon="chevronLeft" onClick={onBack} />
      </span>
      <h3 ref={headingRef} className={`${styles.name} textTitle`} tabIndex={-1} data-project-heading>
        {name}
      </h3>
      {isArchived ? (
        <>
          <span className={`${styles.archived} textTag`}>
            <Icon name="archive" size="sm" />
            Archived
          </span>
          <Button variant="secondary" onClick={handleRestore}>
            Restore
          </Button>
        </>
      ) : (
        <>
          <div className={styles.tools}>
            <IconButton label="Edit project" icon="pencil" onClick={handleEdit} />
            <IconButton label="Archive project" icon="archive" onClick={handleArchive} />
          </div>
          <Button variant="secondary" onClick={onAdd}>
            <Icon name="plus" size="sm" />
            {addLabel}
          </Button>
        </>
      )}
    </div>
  )
}

export default memo(ProjectHeader)
