import { memo, useCallback, useId } from 'react'
import { useTaskStore } from '../../../../store/useTaskStore'
import { DUE_CHOICE, useTaskForm } from '../../../../hooks/useTaskForm'
import { useToday } from '../../../../hooks/useToday'
import Button from '../../../ui/Button'
import DateField from '../../../ui/DateField'
import FieldReveal from '../../../ui/FieldReveal'
import Icon from '../../../ui/Icon'
import SegmentedControl from '../../../ui/SegmentedControl'
import TextField from '../../../ui/TextField'
import styles from './TaskForm.module.css'

const DUE_OPTIONS = [
  { value: DUE_CHOICE.NONE, label: 'Anytime' },
  { value: DUE_CHOICE.TODAY, label: 'Today' },
  { value: DUE_CHOICE.SUNDAY, label: 'By Sunday' },
  { value: DUE_CHOICE.DATE, label: 'Pick a date' },
]

/* Adds a new task (to a project when projectId is set), or edits the given one when task is set */
function TaskForm({ task = null, projectId = null, initialDueChoice = DUE_CHOICE.NONE, headerAction = null, onAdd, onSave } = {}) {
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const headingId = useId()
  const dueName = useId()
  const today = useToday()
  const isEditing = Boolean(task)

  const handleCreate = useCallback(
    (task = {}) => {
      if (!addTask({ ...task, projectId })) return
      onAdd?.(task)
    },
    [addTask, projectId, onAdd],
  )

  const handleUpdate = useCallback(
    (values = {}) => {
      const changes = { ...values, title: values.title.trim(), description: values.description.trim() }
      updateTask(task.id, changes)
      onSave?.(changes)
    },
    [task, updateTask, onSave],
  )

  const {
    formRef,
    errors,
    title,
    description,
    dueChoice,
    date,
    handleTitleChange,
    handleDescriptionChange,
    handleDueChoiceChange,
    handleDateChange,
    handleSubmit,
  } = useTaskForm({ onSubmit: isEditing ? handleUpdate : handleCreate, initialDueChoice, task })

  return (
    <form ref={formRef} className={styles.form} aria-labelledby={headingId} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 id={headingId} className={`${styles.title} textHeadingBold`}>
          {isEditing ? 'Edit task' : 'New task'}
        </h2>
        {headerAction}
      </div>
      <TextField label="Task" value={title} onChange={handleTitleChange} error={errors.title} isRequired isAutoFocused />
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        isMultiline
        isOptional
      />
      <SegmentedControl
        legend="When"
        name={dueName}
        options={DUE_OPTIONS}
        value={dueChoice}
        onChange={handleDueChoiceChange}
      />
      <FieldReveal isVisible={dueChoice === DUE_CHOICE.DATE}>
        <DateField label="Date" min={today} value={date} onChange={handleDateChange} error={errors.date} />
      </FieldReveal>
      <Button type="submit" size="lg" className={styles.submit}>
        <Icon name={isEditing ? 'check' : 'plus'} />
        {isEditing ? 'Save changes' : 'Add task'}
      </Button>
    </form>
  )
}

export default memo(TaskForm)
