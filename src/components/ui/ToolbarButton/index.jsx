import { memo, useCallback } from 'react'
import IconButton from '../IconButton'

/* A toggle in a toolbar that runs a command. Only the active button is in the tab order. */
function ToolbarButton({ id = '', label = '', icon = '', isPressed = false, isActive = false, onRun } = {}) {
  const handleClick = useCallback(() => onRun?.(id), [id, onRun])

  return (
    <IconButton
      label={label}
      icon={icon}
      hasLift={false}
      isPressed={isPressed}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
    />
  )
}

export default memo(ToolbarButton)
