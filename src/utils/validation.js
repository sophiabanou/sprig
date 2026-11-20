import { toDateKey } from './dates'

export const HABIT_TARGET = { min: 1, max: 99 }

const MESSAGES = {
  taskTitle: 'Enter a name for the task.',
  dateMissing: 'Pick a date, or choose another option.',
  datePast: 'Pick today or a later date.',
  habitName: 'Enter a name for the habit.',
  habitDuplicate: 'You already have a habit with this name.',
  habitTarget: `Enter a whole number from ${HABIT_TARGET.min} to ${HABIT_TARGET.max}.`,
}

/* Each validator returns an object of field name to message, empty when the values are valid. */
export function validateTask({ title = '', isDateChosen = false, date = '' } = {}, keptDate = '') {
  const errors = {}
  if (!title.trim()) errors.title = MESSAGES.taskTitle
  if (isDateChosen && !date) errors.date = MESSAGES.dateMissing
  else if (isDateChosen && date < toDateKey() && date !== keptDate) errors.date = MESSAGES.datePast
  return errors
}

export function validateHabit({ name = '', target = '' } = {}, existingNames = []) {
  const errors = {}
  const trimmedName = name.trim().toLowerCase()
  if (!trimmedName) errors.name = MESSAGES.habitName
  else if (existingNames.some((existing) => existing.toLowerCase() === trimmedName)) errors.name = MESSAGES.habitDuplicate

  const number = Number(target)
  if (target === '' || !Number.isInteger(number) || number < HABIT_TARGET.min || number > HABIT_TARGET.max) {
    errors.target = MESSAGES.habitTarget
  }
  return errors
}

export function hasErrors(errors = {}) {
  return Object.keys(errors).length > 0
}
