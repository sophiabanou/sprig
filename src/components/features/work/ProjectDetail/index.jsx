import { memo, useEffect, useMemo, useRef } from 'react'
import { useCompleteAnnouncement } from '../../../../hooks/useCompleteAnnouncement'
import { useNoteSelection } from '../../../../hooks/useNoteSelection'
import { useNotes } from '../../../../hooks/useNotes'
import { DUE_CHOICE } from '../../../../hooks/useTaskForm'
import { useTaskDelete } from '../../../../hooks/useTaskDelete'
import { useTaskDrawer } from '../../../../hooks/useTaskDrawer'
import { useTaskGroups } from '../../../../hooks/useTaskGroups'
import { useViewSwap } from '../../../../hooks/useViewSwap'
import { VIEW_SWAP } from '../../../../utils/motion'
import { countNotes } from '../../../../utils/notes'
import { PROJECT_TAB } from '../../../../utils/projects'
import { countLeft } from '../../../../utils/tasks'
import Drawer from '../../../ui/Drawer'
import IconButton from '../../../ui/IconButton'
import TextTabs from '../../../ui/TextTabs'
import TaskForm from '../../tasks/TaskForm'
import ProjectHeader from '../ProjectHeader'
import ProjectNotes from '../ProjectNotes'
import ProjectTaskList from '../ProjectTaskList'
import styles from './ProjectDetail.module.css'

const PROJECT_TABS = [
  { id: PROJECT_TAB.TASKS, label: 'Tasks' },
  { id: PROJECT_TAB.NOTES, label: 'Notes' },
]

const NOTE_LIST_VIEW = ''

/* Tabs slide the way they sit in the tab bar: Notes comes in from the right, Tasks from the left */
const getTabOffset = (fromKey, toKey) => ({ x: toKey === PROJECT_TAB.NOTES ? VIEW_SWAP.slide : -VIEW_SWAP.slide, y: 0 })

/*
  The open project, with its tasks and notes in tabs. Remount it with the project id as key to switch projects,
  so an open note closes. The tab lives with the parent, so it stays the same from one project to the next.
*/
function ProjectDetail({
  project = {},
  activeTab = PROJECT_TAB.TASKS,
  rootRef = null,
  onTabChange,
  onBack,
  onEdit,
  onArchive,
  onRestore,
} = {}) {
  const { id = null, name = '' } = project
  const headingRef = useRef(null)
  const isTasksTab = activeTab === PROJECT_TAB.TASKS
  const { elementRef: tabPanelRef, shownKey: shownTab } = useViewSwap(activeTab, { getOffset: getTabOffset })

  const { dated, general } = useTaskGroups(id)
  const tasks = useMemo(() => [...dated, ...general], [dated, general])
  const isComplete = tasks.length > 0 && tasks.every((task) => task.isDone)
  const { handleDelete: handleDeleteTask } = useTaskDelete({ headingRef })
  const { isOpen, formKey, editingTask, handleNew, handleEdit, handleAdd, handleSave, handleClose, handleClosed } =
    useTaskDrawer()
  useCompleteAnnouncement(`${name} tasks`, isComplete)

  const notes = useNotes(id)
  const {
    listRef,
    selectedNote,
    isEditorOpen,
    autoFocusId,
    handleNew: handleNewNote,
    handleSelect,
    handleBack: handleNoteBack,
    handleDeleteNote,
    restoreFocus,
  } = useNoteSelection(notes, { projectId: id, headingRef, shouldFocusOnOpen: true, shouldDeferFocus: true })
  const noteView = isEditorOpen && selectedNote ? selectedNote.id : NOTE_LIST_VIEW
  const { elementRef: notesRef, shownKey: shownNoteId } = useViewSwap(noteView)

  useEffect(() => {
    if (shownNoteId === NOTE_LIST_VIEW) restoreFocus()
  }, [shownNoteId, restoreFocus])

  let countText = ''
  if (isTasksTab && tasks.length > 0) countText = countLeft(tasks)
  if (!isTasksTab && notes.length > 0) countText = countNotes(notes.length)

  const countTag = useMemo(
    () => (countText ? <span className={`${styles.count} textCaption`}>{countText}</span> : null),
    [countText],
  )

  const closeButton = useMemo(
    () => <IconButton label="Close" icon="close" onClick={handleClose} />,
    [handleClose],
  )

  return (
    <div ref={rootRef} className={styles.detail}>
      <ProjectHeader
        project={project}
        headingRef={headingRef}
        addLabel={isTasksTab ? 'Add task' : 'Add note'}
        onBack={onBack}
        onAdd={isTasksTab ? handleNew : handleNewNote}
        onEdit={onEdit}
        onArchive={onArchive}
        onRestore={onRestore}
      />
      <TextTabs
        label={name}
        tabs={PROJECT_TABS}
        activeId={activeTab}
        aside={countTag}
        isFilling={shownTab === PROJECT_TAB.NOTES && shownNoteId !== NOTE_LIST_VIEW}
        panelRef={tabPanelRef}
        onChange={onTabChange}
      >
        {shownTab === PROJECT_TAB.TASKS ? (
          <ProjectTaskList tasks={tasks} projectId={id} onEdit={handleEdit} onDelete={handleDeleteTask} />
        ) : (
          <ProjectNotes
            projectId={id}
            notes={notes}
            openNoteId={shownNoteId || null}
            rootRef={notesRef}
            listRef={listRef}
            autoFocusId={autoFocusId}
            onSelect={handleSelect}
            onBack={handleNoteBack}
            onDelete={handleDeleteNote}
          />
        )}
      </TextTabs>
      <Drawer label={editingTask ? 'Edit task' : 'New task'} isOpen={isOpen} onClose={handleClose} onClosed={handleClosed}>
        <TaskForm
          key={formKey}
          task={editingTask}
          projectId={id}
          initialDueChoice={DUE_CHOICE.NONE}
          onAdd={handleAdd}
          onSave={handleSave}
          headerAction={closeButton}
        />
      </Drawer>
    </div>
  )
}

export default memo(ProjectDetail)
