import { useCallback, useMemo, useState } from 'react'
import { endOfWeek, toDateKey } from '../utils/dates'
import { validateTask } from '../utils/validation'
import { useFormValidation } from './useFormValidation'

export const DUE_CHOICE = {
  NONE: 'none',
  TODAY: 'today',
  SUNDAY: 'sunday',
  DATE: 'date',
}

function getDueDate(choice = DUE_CHOICE.NONE, date = '') {
  if (choice === DUE_CHOICE.TODAY) return toDateKey()
  if (choice === DUE_CHOICE.SUNDAY) return toDateKey(endOfWeek())
  if (choice === DUE_CHOICE.DATE) return date || null
  return null
}

function getDueChoice(dueDate = null) {
  if (!dueDate) return DUE_CHOICE.NONE
  if (dueDate === toDateKey()) return DUE_CHOICE.TODAY
  if (dueDate === toDateKey(endOfWeek())) return DUE_CHOICE.SUNDAY
  return DUE_CHOICE.DATE
}

/* Starts empty for a new task, or from the given task when editing one. A task being edited may keep its own past date. */
export function useTaskForm({ onSubmit, initialDueChoice = DUE_CHOICE.NONE, task = null } = {}) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [dueChoice, setDueChoice] = useState(task ? getDueChoice(task.dueDate) : initialDueChoice)
  const [date, setDate] = useState(task?.dueDate ?? '')

  const keptDate = task?.dueDate ?? ''
  const validate = useCallback((formValues) => validateTask(formValues, keptDate), [keptDate])
  const values = useMemo(() => ({ title, isDateChosen: dueChoice === DUE_CHOICE.DATE, date }), [title, dueChoice, date])
  const { formRef, errors, checkForSubmit } = useFormValidation(validate, values)

  const handleTitleChange = useCallback((event) => setTitle(event.target.value), [])
  const handleDescriptionChange = useCallback((event) => setDescription(event.target.value), [])
  const handleDueChoiceChange = useCallback((value) => setDueChoice(value), [])
  const handleDateChange = useCallback((dateKey = '') => setDate(dateKey), [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (!checkForSubmit()) return
      onSubmit?.({ title, description, dueDate: getDueDate(dueChoice, date) })
      setTitle('')
      setDescription('')
    },
    [title, description, dueChoice, date, onSubmit, checkForSubmit],
  )

  return {
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
  }
}
