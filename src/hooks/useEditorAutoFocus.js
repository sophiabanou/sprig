import { useEffect } from 'react'

/*
  Puts the cursor at the start of the editor. Tiptap can destroy its first instance and create another
  while mounting, so this follows the live editor and skips one that is already destroyed.
*/
export function useEditorAutoFocus(editor = null, isAutoFocused = false) {
  useEffect(() => {
    if (!isAutoFocused || !editor || editor.isDestroyed) return
    editor.commands.focus('start')
  }, [editor, isAutoFocused])
}
