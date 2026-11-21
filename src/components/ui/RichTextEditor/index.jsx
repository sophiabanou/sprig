import { memo, useCallback, useLayoutEffect, useState } from 'react'
import { EditorContent } from '@tiptap/react'
import { useRichTextEditor } from '../../../hooks/useRichTextEditor'
import LinkBar from '../LinkBar'
import styles from './RichTextEditor.module.css'

/* header scrolls with the text, above it */
function RichTextEditor({
  initialValue = '',
  label = '',
  titlePlaceholder = '',
  editorRef = null,
  header = null,
  onChange,
} = {}) {
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const handleLinkShortcut = useCallback(() => setIsLinkOpen(true), [])
  const editor = useRichTextEditor({
    initialValue,
    label,
    titlePlaceholder,
    className: styles.content,
    onChange,
    onLinkShortcut: handleLinkShortcut,
  })

  useLayoutEffect(() => {
    if (!editorRef) return undefined
    editorRef.current = editor
    return () => {
      editorRef.current = null
    }
  }, [editor, editorRef])

  const handleLinkClose = useCallback(() => {
    setIsLinkOpen(false)
    editor?.commands.focus()
  }, [editor])

  /* With nothing selected and no link at the cursor, the address itself is added as the link text */
  const handleLinkApply = useCallback(
    (url = '') => {
      setIsLinkOpen(false)
      if (!editor) return
      const chain = editor.chain().focus().extendMarkRange('link')
      if (!url) chain.unsetLink().run()
      else if (editor.state.selection.empty && !editor.isActive('link')) {
        chain.insertContent({ type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url } }] }).run()
      } else chain.setLink({ href: url }).run()
    },
    [editor],
  )

  const handleLinkRemove = useCallback(() => {
    setIsLinkOpen(false)
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
  }, [editor])

  return (
    <div className={styles.editor}>
      {isLinkOpen && (
        <LinkBar
          initialUrl={editor?.getAttributes('link').href ?? ''}
          hasLink={Boolean(editor?.isActive('link'))}
          onApply={handleLinkApply}
          onRemove={handleLinkRemove}
          onClose={handleLinkClose}
        />
      )}
      <div className={styles.scroll}>
        {header}
        <EditorContent editor={editor} className={styles.body} />
      </div>
    </div>
  )
}

export default memo(RichTextEditor)
