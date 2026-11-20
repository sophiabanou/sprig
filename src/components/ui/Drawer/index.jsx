import { memo, useCallback } from 'react'
import { useDrawerTransition } from '../../../hooks/useDrawerTransition'
import { useSheetSwipe } from '../../../hooks/useSheetSwipe'
import styles from './Drawer.module.css'

/* The cancel event (Esc) is intercepted so closing always goes through the exit animation. */
function Drawer({ label = '', isOpen = false, onClose, onClosed, children = null } = {}) {
  const { dialogRef, scrimRef, panelRef } = useDrawerTransition(isOpen)
  useSheetSwipe({ panelRef, scrimRef, onDismiss: onClose })

  const handleCancel = useCallback(
    (event) => {
      event.preventDefault()
      onClose?.()
    },
    [onClose],
  )

  const handleDialogClose = useCallback(() => {
    onClose?.()
    onClosed?.()
  }, [onClose, onClosed])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onCancel={handleCancel}
      onClose={handleDialogClose}
    >
      <div ref={scrimRef} className={styles.scrim} aria-hidden="true" onClick={onClose} />
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.grabber} aria-hidden="true" />
        {children}
      </div>
    </dialog>
  )
}

export default memo(Drawer)
