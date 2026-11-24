import { useCallback, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'
import { useViewSwap } from './useViewSwap'
import { VIEW_SWAP } from '../utils/motion'

/* Matches the breakpoint in the work CSS where the project list and the open project take turns */
const COMPACT_QUERY = '(max-width: 768px)'

const VIEW = {
  LIST: 'list',
  DETAIL: 'detail',
}

const FOCUS_HEADING = 'heading'

/* The open project comes in from the right, and the list comes back from the left */
const getViewOffset = (fromKey, toKey) => ({ x: toKey === VIEW.DETAIL ? VIEW_SWAP.slide : -VIEW_SWAP.slide, y: 0 })

/*
  Which project is open. Falls back to the first project when none is chosen or the chosen one is gone.
  Pass active projects before archived ones, so the fallback prefers an active project.
  On small screens the list and the project take turns, sliding between each other: opening a project moves
  focus to its name, and going back returns focus to its row once the list is in view.
*/
export function useProjectSelection(projects = []) {
  const [selectedId, setSelectedId] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const isCompact = useMediaQuery(COMPACT_QUERY)
  const focusRequestRef = useRef(null)
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0] ?? null
  const currentId = selectedProject?.id ?? null

  const { elementRef: workspaceRef, shownKey: shownView } = useViewSwap(isDetailOpen ? VIEW.DETAIL : VIEW.LIST, {
    getOffset: getViewOffset,
    isEnabled: isCompact,
  })

  useEffect(() => {
    const request = focusRequestRef.current
    focusRequestRef.current = null
    if (!request || !isCompact) return
    const selector = request === FOCUS_HEADING ? '[data-project-heading]' : `[data-project-id="${request}"]`
    workspaceRef.current?.querySelector(selector)?.focus()
  }, [shownView, isCompact, workspaceRef])

  const handleSelect = useCallback(
    (project = {}) => {
      setSelectedId(project.id ?? null)
      setIsDetailOpen(true)
      if (isCompact) focusRequestRef.current = FOCUS_HEADING
    },
    [isCompact],
  )

  const handleBack = useCallback(() => {
    focusRequestRef.current = currentId
    setIsDetailOpen(false)
  }, [currentId])

  /* Changes the open project without moving between views or focus, for when the open one is put away */
  const selectProject = useCallback((id = null) => setSelectedId(id), [])

  return { selectedProject, currentId, isCompact, workspaceRef, shownView, handleSelect, handleBack, selectProject }
}
