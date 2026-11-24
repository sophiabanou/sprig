import { useCallback, useMemo, useState } from 'react'
import { useProjectStore } from '../store/useProjectStore'
import { validateProject } from '../utils/validation'
import { useFormValidation } from './useFormValidation'

/* Starts empty for a new project, or from the given project when editing one. A project being edited may keep its own name. */
export function useProjectForm({ onSubmit, project = null } = {}) {
  const [name, setName] = useState(project?.name ?? '')
  const [tone, setTone] = useState(project?.tone ?? 'rose')

  const projects = useProjectStore((state) => state.projects)
  const editingId = project?.id
  const existingNames = useMemo(
    () => projects.filter((item) => item.id !== editingId).map((item) => item.name),
    [projects, editingId],
  )
  const validate = useCallback((values) => validateProject(values, existingNames), [existingNames])
  const values = useMemo(() => ({ name }), [name])
  const { formRef, errors, checkForSubmit } = useFormValidation(validate, values)

  const handleNameChange = useCallback((event) => setName(event.target.value), [])
  const handleToneChange = useCallback((value) => setTone(value), [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (!checkForSubmit()) return
      onSubmit?.({ name: name.trim(), tone })
    },
    [name, tone, onSubmit, checkForSubmit],
  )

  return { formRef, errors, name, tone, handleNameChange, handleToneChange, handleSubmit }
}
