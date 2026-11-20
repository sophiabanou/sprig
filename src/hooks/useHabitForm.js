import { useCallback, useMemo, useState } from 'react'
import { HABIT_FREQUENCY, HABIT_ICON_COLORS, HABIT_ICONS, useHabitStore } from '../store/useHabitStore'
import { validateHabit } from '../utils/validation'
import { useFormValidation } from './useFormValidation'

/* Starts empty for a new habit, or from the given habit when editing one. A habit being edited may keep its own name. */
export function useHabitForm({ onSubmit, initialFrequency = HABIT_FREQUENCY.DAILY, habit = null } = {}) {
  const [name, setName] = useState(habit?.name ?? '')
  const [description, setDescription] = useState(habit?.description ?? '')
  const [frequency, setFrequency] = useState(habit?.frequency ?? initialFrequency)
  const [target, setTarget] = useState(String(habit?.target ?? 1))
  const [icon, setIcon] = useState(habit?.icon ?? HABIT_ICONS[0])
  const [color, setColor] = useState(habit?.color ?? HABIT_ICON_COLORS[HABIT_ICONS[0]])

  const habits = useHabitStore((state) => state.habits)
  const editingId = habit?.id
  const existingNames = useMemo(
    () => habits.filter((item) => item.id !== editingId).map((item) => item.name),
    [habits, editingId],
  )
  const validate = useCallback((values) => validateHabit(values, existingNames), [existingNames])
  const values = useMemo(() => ({ name, target }), [name, target])
  const { formRef, errors, checkForSubmit } = useFormValidation(validate, values)

  const handleNameChange = useCallback((event) => setName(event.target.value), [])
  const handleDescriptionChange = useCallback((event) => setDescription(event.target.value), [])
  const handleFrequencyChange = useCallback((value) => setFrequency(value), [])
  const handleTargetChange = useCallback((value) => setTarget(value), [])
  const handleColorChange = useCallback((value) => setColor(value), [])

  const handleIconChange = useCallback((value) => {
    setIcon(value)
    setColor(HABIT_ICON_COLORS[value])
  }, [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (!checkForSubmit()) return
      onSubmit?.({ name, description, frequency, target, color, icon })
      setName('')
      setDescription('')
      setTarget('1')
    },
    [name, description, frequency, target, color, icon, onSubmit, checkForSubmit],
  )

  return {
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
  }
}
