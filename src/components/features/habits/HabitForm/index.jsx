import { memo, useCallback, useId } from 'react'
import { HABIT_FREQUENCY, useHabitStore } from '../../../../store/useHabitStore'
import { useHabitForm } from '../../../../hooks/useHabitForm'
import { HABIT_TARGET } from '../../../../utils/validation'
import Button from '../../../ui/Button'
import FieldReveal from '../../../ui/FieldReveal'
import Icon from '../../../ui/Icon'
import NumberField from '../../../ui/NumberField'
import SegmentedControl from '../../../ui/SegmentedControl'
import TextField from '../../../ui/TextField'
import HabitColorPicker from '../HabitColorPicker'
import HabitIconPicker from '../HabitIconPicker'
import styles from './HabitForm.module.css'

const FREQUENCY_OPTIONS = [
  { value: HABIT_FREQUENCY.DAILY, label: 'Daily' },
  { value: HABIT_FREQUENCY.WEEKLY, label: 'Weekly' },
]

/* Adds a new habit, or edits the given one when habit is set */
function HabitForm({ habit = null, initialFrequency = HABIT_FREQUENCY.DAILY, headerAction = null, onAdd, onSave } = {}) {
  const addHabit = useHabitStore((state) => state.addHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)
  const headingId = useId()
  const frequencyName = useId()
  const isEditing = Boolean(habit)
  const editingId = habit?.id
  const hasProgress = useHabitStore((state) => Object.values(state.log[editingId] ?? {}).some((count) => count > 0))

  const handleCreate = useCallback(
    (values = {}) => {
      if (!addHabit(values)) return
      onAdd?.(values)
    },
    [addHabit, onAdd],
  )

  const handleUpdate = useCallback(
    (values = {}) => {
      const changes = { ...values, name: values.name.trim(), description: values.description.trim() }
      updateHabit(habit.id, changes)
      onSave?.(changes)
    },
    [habit, updateHabit, onSave],
  )

  const {
    formRef,
    errors,
    name,
    description,
    frequency,
    target,
    color,
    icon,
    handleNameChange,
    handleDescriptionChange,
    handleFrequencyChange,
    handleTargetChange,
    handleColorChange,
    handleIconChange,
    handleSubmit,
  } = useHabitForm({ onSubmit: isEditing ? handleUpdate : handleCreate, initialFrequency, habit })

  return (
    <form ref={formRef} className={styles.form} aria-labelledby={headingId} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 id={headingId} className={`${styles.title} textHeadingBold`}>
          {isEditing ? 'Edit habit' : 'New habit'}
        </h2>
        {headerAction}
      </div>
      <TextField label="Name" value={name} onChange={handleNameChange} error={errors.name} isRequired isAutoFocused />
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        isMultiline
        isOptional
      />
      <div className={styles.row}>
        <SegmentedControl
          legend="How often"
          name={frequencyName}
          options={FREQUENCY_OPTIONS}
          value={frequency}
          onChange={handleFrequencyChange}
        />
        <NumberField
          label="How many times"
          value={target}
          onChange={handleTargetChange}
          min={HABIT_TARGET.min}
          max={HABIT_TARGET.max}
          hint={frequency === HABIT_FREQUENCY.WEEKLY ? 'per week' : 'per day'}
          error={errors.target}
          isRequired
        />
      </div>
      <FieldReveal isVisible={hasProgress && frequency !== habit?.frequency}>
        <p className={`${styles.note} textCaption`}>Changing how often starts a fresh count.</p>
      </FieldReveal>
      <HabitIconPicker value={icon} color={color} onChange={handleIconChange} />
      <HabitColorPicker value={color} onChange={handleColorChange} />
      <Button type="submit" size="lg" className={styles.submit}>
        <Icon name={isEditing ? 'check' : 'plus'} />
        {isEditing ? 'Save changes' : 'Add habit'}
      </Button>
    </form>
  )
}

export default memo(HabitForm)
