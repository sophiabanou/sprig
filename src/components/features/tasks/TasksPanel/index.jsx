import { memo, useCallback, useMemo, useState } from 'react'
import { useFormDrawer } from '../../../../hooks/useFormDrawer'
import { useTaskGroups } from '../../../../hooks/useTaskGroups'
import { useTaskDelete } from '../../../../hooks/useTaskDelete'
import { DUE_CHOICE } from '../../../../hooks/useTaskForm'
import PageHeader from '../../../layout/PageHeader'
import Button from '../../../ui/Button'
import Drawer from '../../../ui/Drawer'
import Icon from '../../../ui/Icon'
import IconButton from '../../../ui/IconButton'
import ListCard from '../../../ui/ListCard'
import Tabs from '../../../ui/Tabs'
import TaskForm from '../TaskForm'
import TaskRow from '../TaskRow'

const TASK_TAB = {
  DATED: 'dated',
  GENERAL: 'general',
}

const TASK_TABS = [
  { id: TASK_TAB.DATED, label: 'With a date', tone: 'sky' },
  { id: TASK_TAB.GENERAL, label: 'Anytime', tone: 'mint' },
]

function countLeft(tasks = []) {
  const leftCount = tasks.filter((task) => !task.isDone).length
  return leftCount === 0 ? 'All done' : `${leftCount} left`
}

function TasksPanel() {
  const { dated, general } = useTaskGroups()
  const { headingRef, handleDelete } = useTaskDelete()
  const { isOpen, formKey, handleOpen, handleClose, handleClosed, closeWithMessage } = useFormDrawer()
  const [activeTab, setActiveTab] = useState(TASK_TAB.DATED)
  const [editingTask, setEditingTask] = useState(null)
  const isDated = activeTab === TASK_TAB.DATED
  const tasks = isDated ? dated : general

  const handleNew = useCallback(() => {
    setEditingTask(null)
    handleOpen()
  }, [handleOpen])

  const handleEdit = useCallback(
    (task = {}) => {
      setEditingTask(task)
      handleOpen()
    },
    [handleOpen],
  )

  const handleSave = useCallback(
    (task = {}) => {
      setActiveTab(task.dueDate ? TASK_TAB.DATED : TASK_TAB.GENERAL)
      closeWithMessage(`Task updated: ${task.title}`)
    },
    [closeWithMessage],
  )

  const handleAdd = useCallback(
    (task = {}) => {
      setActiveTab(task.dueDate ? TASK_TAB.DATED : TASK_TAB.GENERAL)
      closeWithMessage(`Task added: ${task.title.trim()}`)
    },
    [closeWithMessage],
  )

  const newTaskButton = useMemo(
    () => (
      <Button onClick={handleNew}>
        <Icon name="plus" size="sm" />
        New task
      </Button>
    ),
    [handleNew],
  )

  const closeButton = useMemo(
    () => <IconButton label="Close" icon="close" onClick={handleClose} />,
    [handleClose],
  )

  return (
    <>
      <PageHeader
        lead="Your"
        title="tasks"
        tone="sky"
        description="Things to get done, with or without a deadline."
        headingRef={headingRef}
        action={newTaskButton}
      />
      <Tabs label="Task type" tabs={TASK_TABS} activeId={activeTab} onChange={setActiveTab}>
        <ListCard
          title={isDated ? 'With a date' : 'Anytime'}
          illustration={isDated ? 'clock' : 'checklist'}
          tone={isDated ? 'sky' : 'mint'}
          meta={tasks.length > 0 ? countLeft(tasks) : ''}
          isComplete={tasks.length > 0 && tasks.every((task) => task.isDone)}
          emptyTitle={isDated ? 'No deadlines looming.' : 'Nothing on your plate.'}
          emptyText={isDated ? 'Enjoy it, or give a task a due date.' : 'Jot down something to do whenever.'}
          isEmpty={tasks.length === 0}
        >
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </ListCard>
      </Tabs>
      <Drawer label={editingTask ? 'Edit task' : 'New task'} isOpen={isOpen} onClose={handleClose} onClosed={handleClosed}>
        <TaskForm
          key={formKey}
          task={editingTask}
          initialDueChoice={isDated ? DUE_CHOICE.TODAY : DUE_CHOICE.NONE}
          onAdd={handleAdd}
          onSave={handleSave}
          headerAction={closeButton}
        />
      </Drawer>
    </>
  )
}

export default memo(TasksPanel)
