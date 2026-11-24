import { memo, useMemo } from 'react'
import { useListEntrance } from '../../../../hooks/useListEntrance'
import { useProjectSearch } from '../../../../hooks/useProjectSearch'
import { countProjects } from '../../../../utils/projects'
import SearchField from '../../../ui/SearchField'
import VisuallyHidden from '../../../ui/VisuallyHidden'
import ProjectArchive from '../ProjectArchive'
import ProjectListItem from '../ProjectListItem'
import styles from './ProjectSidebar.module.css'

function ProjectSidebar({
  projects = [],
  archivedProjects = [],
  selectedId = null,
  query = '',
  listLabel = '',
  onQueryChange,
  onSelect,
} = {}) {
  const matches = useProjectSearch(projects, query)
  const archivedMatches = useProjectSearch(archivedProjects, query)
  const matchCount = matches.length + archivedMatches.length
  const isSearching = Boolean(query.trim())
  const keys = useMemo(() => matches.map((project) => project.id), [matches])
  const listRef = useListEntrance(keys, query)

  return (
    <div className={styles.sidebar}>
      <div className={styles.search}>
        <SearchField label="Search projects" value={query} onChange={onQueryChange} />
        <VisuallyHidden role="status">{isSearching ? `${countProjects(matchCount)} found` : ''}</VisuallyHidden>
      </div>
      <div className={styles.scroll}>
        {isSearching && matchCount === 0 && (
          <p className={`${styles.empty} textBody`}>No projects match your search.</p>
        )}
        {!isSearching && projects.length === 0 && (
          <p className={`${styles.empty} textBody`}>Every project is archived.</p>
        )}
        <ul ref={listRef} className={styles.list} aria-label={listLabel}>
          {matches.map((project) => (
            <ProjectListItem key={project.id} project={project} isSelected={project.id === selectedId} onSelect={onSelect} />
          ))}
        </ul>
        <ProjectArchive
          projects={archivedMatches}
          selectedId={selectedId}
          isSearching={isSearching}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
}

export default memo(ProjectSidebar)
