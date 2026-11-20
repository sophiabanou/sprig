import { memo, useCallback, useLayoutEffect, useRef } from 'react'
import { useFadePresence } from '../../../hooks/useFadePresence'
import { ENTRANCE } from '../../../utils/motion'
import { useLastValue } from '../../../hooks/useLastValue'
import { useToastTimer } from '../../../hooks/useToastTimer'
import { TOAST_DURATION, useToastStore } from '../../../store/useToastStore'
import styles from './Toast.module.css'

const TOAST_MOTION = { rise: ENTRANCE.rise * 2 }

/*
  Shows the current toast with its action. A new toast takes focus on its action, so keyboard users can act
  on it at once. Whenever the toast closes while it holds focus, focus moves to the toast's returnFocus.
  The message itself is announced by whoever shows the toast, through the live region.
*/
function Toast() {
  const toast = useToastStore((state) => state.toast)
  const dismissToast = useToastStore((state) => state.dismissToast)
  const shownToast = useLastValue(toast)
  const { elementRef, isRendered, isLeaving } = useFadePresence(Boolean(toast), TOAST_MOTION)
  const actionRef = useRef(null)
  const toastId = toast?.id ?? null

  const close = useCallback(() => {
    const element = elementRef.current
    if (element?.contains(document.activeElement)) shownToast?.returnFocus?.focus()
    dismissToast(shownToast?.id)
  }, [elementRef, shownToast, dismissToast])

  const timerHandlers = useToastTimer(toastId, TOAST_DURATION, close)

  useLayoutEffect(() => {
    if (toastId !== null) actionRef.current?.focus()
  }, [toastId])

  const handleAction = useCallback(() => {
    shownToast?.onAction?.()
    close()
  }, [shownToast, close])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') close()
    },
    [close],
  )

  if (!isRendered || !shownToast) return null

  return (
    <div
      ref={elementRef}
      className={styles.toast}
      inert={isLeaving}
      onKeyDown={handleKeyDown}
      onPointerEnter={timerHandlers.handlePointerEnter}
      onPointerLeave={timerHandlers.handlePointerLeave}
      onFocus={timerHandlers.handleFocus}
      onBlur={timerHandlers.handleBlur}
    >
      <p className={`${styles.message} textBody`}>{shownToast.message}</p>
      {shownToast.actionLabel && (
        <button ref={actionRef} type="button" className={`${styles.action} textButton`} onClick={handleAction}>
          {shownToast.actionLabel}
        </button>
      )}
    </div>
  )
}

export default memo(Toast)
