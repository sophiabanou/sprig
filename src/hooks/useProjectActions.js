import { useCallback, useState } from 'react'
import { useAnnouncerStore } from '../store/useAnnouncerStore'
import { useProjectStore } from '../store/useProjectStore'
import { useToastStore } from '../store/useToastStore'
import { useFormDrawer } from './useFormDrawer'

/*
  Adding, editing, archiving and restoring projects. The drawer holds the project form for a new project or
  the one being edited. Archiving opens the next active project and offers to undo it in a toast, which
  returns focus to the page heading when it closes.
*/
export function useProjectActions({ activeProjects = [], headingRef = null, onAdded, selectProject } = {}) {
  const setArchived = useProjectStore((state) => state.setArchived)
  const announce = useAnnouncerStore((state) => state.announce)
  const showToast = useToastStore((state) => state.showToast)
  const { isOpen, formKey, handleOpen, handleClose, handleClosed, closeWithMessage } = useFormDrawer()
  const [editingProject, setEditingProject] = useState(null)

  const handleNew = useCallback(() => {
    setEditingProject(null)
    handleOpen()
  }, [handleOpen])

  const handleEdit = useCallback(
    (project = {}) => {
      setEditingProject(project)
      handleOpen()
    },
    [handleOpen],
  )

  const handleAdd = useCallback(
    (project = {}) => {
      onAdded?.(project)
      closeWithMessage(`Project added: ${project.name}`)
    },
    [onAdded, closeWithMessage],
  )

  const handleSave = useCallback(
    (project = {}) => closeWithMessage(`Project updated: ${project.name}`),
    [closeWithMessage],
  )

  const handleArchive = useCallback(
    ({ id = '', name = '' } = {}) => {
      const index = activeProjects.findIndex((project) => project.id === id)
      const nextProject = activeProjects[index + 1] ?? activeProjects[index - 1] ?? null
      setArchived(id, true)
      selectProject?.(nextProject?.id ?? null)
      announce(`Project archived: ${name}`)
      showToast({
        message: `Project archived: ${name}`,
        actionLabel: 'Undo',
        returnFocus: headingRef?.current,
        onAction: () => {
          setArchived(id, false)
          selectProject?.(id)
          announce(`Project restored: ${name}`)
        },
      })
    },
    [activeProjects, headingRef, setArchived, selectProject, announce, showToast],
  )

  const handleRestore = useCallback(
    ({ id = '', name = '' } = {}) => {
      setArchived(id, false)
      announce(`Project restored: ${name}`)
    },
    [setArchived, announce],
  )

  return {
    isOpen,
    formKey,
    editingProject,
    handleNew,
    handleEdit,
    handleAdd,
    handleSave,
    handleArchive,
    handleRestore,
    handleClose,
    handleClosed,
  }
}
