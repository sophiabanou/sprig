import { useEffect, useRef } from 'react'
import { useAnnouncerStore } from '../store/useAnnouncerStore'

/* Announces when the named list becomes complete. Mounting or switching to a list that is already complete stays quiet. */
export function useCompleteAnnouncement(title = '', isComplete = false) {
  const announce = useAnnouncerStore((state) => state.announce)
  const previousRef = useRef({ title, isComplete })

  useEffect(() => {
    const previous = previousRef.current
    previousRef.current = { title, isComplete }
    if (isComplete && !previous.isComplete && previous.title === title) announce(`${title}: all done`)
  }, [title, isComplete, announce])
}
