import { memo, useCallback, useLayoutEffect, useState } from 'react'
import { EditorContent } from '@tiptap/react'
import { useRichTextEditor } from '../../../hooks/useRichTextEditor'
import { useToolbarNavigation } from '../../../hooks/useToolbarNavigation'
import LinkBar from '../LinkBar'
import ToolbarButton from '../ToolbarButton'
import styles from './RichTextEditor.module.css'

const TOOLS = [
  { id: 'heading', label: 'Heading', icon: 'heading' },
  { id: 'subheading', label: 'Subheading', icon: 'subheading' },
  { id: 'bold', label: 'Bold', icon: 'bold' },
  { id: 'italic', label: 'Italic', icon: 'italic' },
  { id: 'bulletList', label: 'Bulleted list', icon: 'list' },
  { id: 'orderedList', label: 'Numbered list', icon: 'listNumbered' },
  { id: 'taskList', label: 'Checklist', icon: 'checklist' },
  { id: 'link', label: 'Link', icon: 'link' },
]

const COMMANDS = {
  heading: (chain) => chain.toggleHeading({ level: 2 }),
  subheading: (chain) => chain.toggleHeading({ level: 3 }),
  bold: (chain) => chain.toggleBold(),
  italic: (chain) => chain.toggleItalic(),
  bulletList: (chain) => chain.toggleBulletList(),
  orderedList: (chain) => chain.toggleOrderedList(),
  taskList: (chain) => chain.toggleTaskList(),
}

/* barStart and barEnd sit on either side of the formatting toolbar, and header scrolls with the text above it */
function RichTextEditor({
  initialValue = '',
  label = '',
  titlePlaceholder = '',
  placeholder = '',
  toolbarLabel = 'Formatting',
  editorRef = null,
  barStart = null,
  barEnd = null,
  header = null,
  onChange,
} = {}) {
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const handleLinkShortcut = useCallback(() => setIsLinkOpen(true), [])
  const { editor, formats } = useRichTextEditor({
    initialValue,
    label,
    titlePlaceholder,
    placeholder,
    className: styles.content,
    onChange,
    onLinkShortcut: handleLinkShortcut,
  })
  const { activeIndex, handleFocus, handleKeyDown } = useToolbarNavigation()

  useLayoutEffect(() => {
    if (!editorRef) return undefined
    editorRef.current = editor
    return () => {
      editorRef.current = null
    }
  }, [editor, editorRef])

  const handleRun = useCallback(
    (id = '') => {
      if (!editor) return
      if (id === 'link') {
        setIsLinkOpen(true)
        return
      }
      COMMANDS[id]?.(editor.chain().focus()).run()
    },
    [editor],
  )

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
      <div className={styles.bar}>
        {barStart}
        <div
          role="toolbar"
          aria-label={toolbarLabel}
          className={styles.toolbar}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        >
          {TOOLS.map((tool, index) => (
            <ToolbarButton
              key={tool.id}
              {...tool}
              isPressed={Boolean(formats?.[tool.id])}
              isActive={index === activeIndex}
              onRun={handleRun}
            />
          ))}
        </div>
        {barEnd && <div className={styles.barEnd}>{barEnd}</div>}
      </div>
      {isLinkOpen && (
        <LinkBar
          initialUrl={editor?.getAttributes('link').href ?? ''}
          hasLink={Boolean(formats?.link)}
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
