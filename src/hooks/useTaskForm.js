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

export function useTaskForm({ onSubmit, initialDueChoice = DUE_CHOICE.NONE } = {}) {
  const [title, setTitle] = useState('')
  const [dueChoice, setDueChoice] = useState(initialDueChoice)
  const [date, setDate] = useState('')

  const values = useMemo(() => ({ title, isDateChosen: dueChoice === DUE_CHOICE.DATE, date }), [title, dueChoice, date])
  const { formRef, errors, checkForSubmit } = useFormValidation(validateTask, values)

  const handleTitleChange = useCallback((event) => setTitle(event.target.value), [])
  const handleDueChoiceChange = useCallback((value) => setDueChoice(value), [])
  const handleDateChange = useCallback((dateKey = '') => setDate(dateKey), [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (!checkForSubmit()) return
      onSubmit?.({ title, dueDate: getDueDate(dueChoice, date) })
      setTitle('')
    },
    [title, dueChoice, date, onSubmit, checkForSubmit],
  )

  return {
    formRef,
    errors,
    title,
    dueChoice,
    date,
    handleTitleChange,
    handleDueChoiceChange,
    handleDateChange,
    handleSubmit,
  }
}
