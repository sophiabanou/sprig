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

function TaskForm({ initialDueChoice = DUE_CHOICE.NONE, headerAction = null, onAdd } = {}) {
  const addTask = useTaskStore((state) => state.addTask)
  const headingId = useId()
  const dueName = useId()
  const today = useToday()

  const handleCreate = useCallback(
    (task = {}) => {
      if (!addTask(task)) return
      onAdd?.(task)
    },
    [addTask, onAdd],
  )

  const { formRef, errors, title, dueChoice, date, handleTitleChange, handleDueChoiceChange, handleDateChange, handleSubmit } =
    useTaskForm({ onSubmit: handleCreate, initialDueChoice })

  return (
    <form ref={formRef} className={styles.form} aria-labelledby={headingId} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 id={headingId} className={`${styles.title} textHeadingBold`}>
          New task
        </h2>
        {headerAction}
      </div>
      <TextField label="Task" value={title} onChange={handleTitleChange} error={errors.title} isRequired isAutoFocused />
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
        <Icon name="plus" />
        Add task
      </Button>
    </form>
  )
}

export default memo(TaskForm)
