import { memo, useCallback, useId } from 'react'
import { useProjectStore } from '../../../../store/useProjectStore'
import { useProjectForm } from '../../../../hooks/useProjectForm'
import Button from '../../../ui/Button'
import ColorPicker from '../../../ui/ColorPicker'
import Icon from '../../../ui/Icon'
import TextField from '../../../ui/TextField'
import styles from './ProjectForm.module.css'

/* Adds a new project, or edits the given one when project is set */
function ProjectForm({ project = null, headerAction = null, onAdd, onSave } = {}) {
  const addProject = useProjectStore((state) => state.addProject)
  const updateProject = useProjectStore((state) => state.updateProject)
  const headingId = useId()
  const isEditing = Boolean(project)

  const handleCreate = useCallback(
    (values = {}) => {
      const id = addProject(values)
      if (id) onAdd?.({ ...values, id })
    },
    [addProject, onAdd],
  )

  const handleUpdate = useCallback(
    (values = {}) => {
      updateProject(project.id, values)
      onSave?.({ ...project, ...values })
    },
    [project, updateProject, onSave],
  )

  const { formRef, errors, name, tone, handleNameChange, handleToneChange, handleSubmit } = useProjectForm({
    onSubmit: isEditing ? handleUpdate : handleCreate,
    project,
  })

  return (
    <form ref={formRef} className={styles.form} aria-labelledby={headingId} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 id={headingId} className={`${styles.title} textHeadingBold`}>
          {isEditing ? 'Edit project' : 'New project'}
        </h2>
        {headerAction}
      </div>
      <TextField label="Project" value={name} onChange={handleNameChange} error={errors.name} isRequired isAutoFocused />
      <ColorPicker value={tone} onChange={handleToneChange} />
      <Button type="submit" size="lg" className={styles.submit}>
        <Icon name={isEditing ? 'check' : 'plus'} />
        {isEditing ? 'Save changes' : 'Add project'}
      </Button>
    </form>
  )
}

export default memo(ProjectForm)
