import { memo, useCallback, useId, useMemo, useRef, useState } from 'react'
import { usePanelReveal } from '../../../../hooks/usePanelReveal'
import { useProjectActions } from '../../../../hooks/useProjectActions'
import { useProjects } from '../../../../hooks/useProjects'
import { useProjectSelection } from '../../../../hooks/useProjectSelection'
import { useViewSwap } from '../../../../hooks/useViewSwap'
import { countProjects, PROJECT_TAB } from '../../../../utils/projects'
import { getToneClass } from '../../../../utils/tones'
import PageHeader from '../../../layout/PageHeader'
import Button from '../../../ui/Button'
import Drawer from '../../../ui/Drawer'
import Icon from '../../../ui/Icon'
import IconButton from '../../../ui/IconButton'
import ListCard from '../../../ui/ListCard'
import ListHeader from '../../../ui/ListHeader'
import ProjectDetail from '../ProjectDetail'
import ProjectForm from '../ProjectForm'
import ProjectSidebar from '../ProjectSidebar'
import styles from './WorkPanel.module.css'

/* The empty state and the projects share the Projects heading, so switching between them only moves the content */
const PANEL_REVEAL = { hasSharedHeading: true }

function WorkPanel() {
  const { activeProjects, archivedProjects, allProjects } = useProjects()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState(PROJECT_TAB.TASKS)
  const listHeadingId = useId()
  const headingRef = useRef(null)
  const { selectedProject, currentId, isCompact, workspaceRef, shownView, handleSelect, handleBack, selectProject } =
    useProjectSelection(allProjects)
  const { elementRef: detailRef, shownKey: shownProjectId } = useViewSwap(currentId, { isEnabled: !isCompact })
  const shownProject = allProjects.find((project) => project.id === shownProjectId) ?? selectedProject

  /* A new project opens right away, so the search is cleared to keep it in the list */
  const handleAdded = useCallback(
    (project = {}) => {
      setQuery('')
      handleSelect(project)
    },
    [handleSelect],
  )

  const {
    isOpen,
    formKey,
    editingProject,
    handleNew,
    handleEdit,
    handleAdd,
    handleSave,
    handleArchive,
    handleRestore,
    handleClose,
    handleClosed,
  } = useProjectActions({ activeProjects, headingRef, onAdded: handleAdded, selectProject })

  const newProjectButton = useMemo(
    () => (
      <Button onClick={handleNew}>
        <Icon name="plus" size="sm" />
        New project
      </Button>
    ),
    [handleNew],
  )

  const closeButton = useMemo(
    () => <IconButton label="Close" icon="close" onClick={handleClose} />,
    [handleClose],
  )

  const isEmpty = allProjects.length === 0
  const panelRef = usePanelReveal(isEmpty ? 'empty' : 'projects', PANEL_REVEAL)

  return (
    <>
      <PageHeader
        lead="Your"
        title="work"
        tone="rose"
        description="Projects, with their own tasks and notes."
        headingRef={headingRef}
        action={newProjectButton}
      />
      <div ref={panelRef} className={styles.panel}>
        {isEmpty ? (
          <ListCard
            title="Projects"
            illustration="folder"
            tone="rose"
            emptyTitle="No projects yet."
            emptyText="Start a project to keep its tasks and notes together."
            isEmpty
          />
        ) : (
          <section className={`${styles.section} ${getToneClass('rose')}`} aria-labelledby={listHeadingId}>
            <ListHeader
              id={listHeadingId}
              title="Projects"
              illustration="folder"
              meta={countProjects(activeProjects.length)}
            />
            <div ref={workspaceRef} className={styles.workspace} data-view={shownView} data-reveal="list-body">
              <ProjectSidebar
                projects={activeProjects}
                archivedProjects={archivedProjects}
                selectedId={currentId}
                query={query}
                listLabel="Projects"
                onQueryChange={setQuery}
                onSelect={handleSelect}
              />
              <ProjectDetail
                key={shownProject.id}
                project={shownProject}
                activeTab={activeTab}
                rootRef={detailRef}
                onTabChange={setActiveTab}
                onBack={handleBack}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onRestore={handleRestore}
              />
            </div>
          </section>
        )}
      </div>
      <Drawer
        label={editingProject ? 'Edit project' : 'New project'}
        isOpen={isOpen}
        onClose={handleClose}
        onClosed={handleClosed}
      >
        <ProjectForm
          key={formKey}
          project={editingProject}
          headerAction={closeButton}
          onAdd={handleAdd}
          onSave={handleSave}
        />
      </Drawer>
    </>
  )
}

export default memo(WorkPanel)
