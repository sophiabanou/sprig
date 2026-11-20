import { useCallback, useRef, useState } from 'react'
import { useAnnouncerStore } from '../store/useAnnouncerStore'

/*
  Open state for a drawer that holds a form. Each open bumps formKey so the form remounts fresh.
  The live region sits outside the modal drawer, where the page is inert while it is open,
  so a message passed to closeWithMessage is announced only once the drawer has fully closed.
*/
export function useFormDrawer() {
  const announce = useAnnouncerStore((state) => state.announce)
  const [isOpen, setIsOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const pendingMessageRef = useRef('')

  const handleOpen = useCallback(() => {
    setFormKey((key) => key + 1)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => setIsOpen(false), [])

  const closeWithMessage = useCallback((message = '') => {
    pendingMessageRef.current = message
    setIsOpen(false)
  }, [])

  const handleClosed = useCallback(() => {
    if (!pendingMessageRef.current) return
    announce(pendingMessageRef.current)
    pendingMessageRef.current = ''
  }, [announce])

  return { isOpen, formKey, handleOpen, handleClose, handleClosed, closeWithMessage }
}
