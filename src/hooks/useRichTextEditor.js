import { useLayoutEffect, useRef } from 'react'
import { mergeAttributes } from '@tiptap/core'
import { useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'

const HEADING_LEVELS = [1, 2, 3]

/* Headings take their size from the typography utilities, since sizes stay out of the CSS modules. Level 1 is the note title. */
const HEADING_CLASSES = { 1: 'textTitle', 2: 'textHeadingBold', 3: 'textHeading' }

/* As in Apple Notes, a note always starts with its title */
const TitledDocument = Document.extend({ content: 'heading block*' })

const StyledHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = HEADING_LEVELS.includes(node.attrs.level) ? node.attrs.level : HEADING_LEVELS[0]
    return [`h${level}`, mergeAttributes(HTMLAttributes, { class: HEADING_CLASSES[level] }), 0]
  },
}).configure({ levels: HEADING_LEVELS })

function readFormats({ editor }) {
  return {
    heading: editor.isActive('heading', { level: 2 }),
    subheading: editor.isActive('heading', { level: 3 }),
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    bulletList: editor.isActive('bulletList'),
    orderedList: editor.isActive('orderedList'),
    taskList: editor.isActive('taskList'),
    link: editor.isActive('link'),
  }
}

/*
  A rich text editor that reads and writes markdown, so notes stay plain markdown in storage. The first
  line is always the title. Typing markdown still works as a shortcut (## for a heading, - for a list,
  [ ] for a checklist) and turns into formatting right away. The text is read once on mount, so remount the editor (with a key) to show
  another note. Returns the editor and which formats are on at the cursor.
*/
export function useRichTextEditor({
  initialValue = '',
  label = '',
  titlePlaceholder = '',
  placeholder = '',
  className = '',
  onChange,
  onLinkShortcut,
} = {}) {
  const onChangeRef = useRef(onChange)
  const onLinkShortcutRef = useRef(onLinkShortcut)

  useLayoutEffect(() => {
    onChangeRef.current = onChange
    onLinkShortcutRef.current = onLinkShortcut
  }, [onChange, onLinkShortcut])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        heading: false,
        code: false,
        codeBlock: false,
        underline: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      TitledDocument,
      StyledHeading,
      TaskList,
      TaskItem.configure({
        nested: true,
        a11y: { checkboxLabel: (node) => node.textContent || 'Empty checklist item' },
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ editor: current, pos }) => {
          if (pos === 0) return titlePlaceholder
          return current.state.doc.childCount <= 2 ? placeholder : ''
        },
      }),
      Markdown.configure({ markedOptions: { breaks: true } }),
    ],
    content: initialValue,
    contentType: 'markdown',
    editorProps: {
      attributes: { role: 'textbox', 'aria-multiline': 'true', 'aria-label': label, class: `textBody ${className}` },
      handleKeyDown: (view, event) => {
        if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return false
        event.preventDefault()
        onLinkShortcutRef.current?.()
        return true
      },
    },
    onUpdate: ({ editor: current }) => onChangeRef.current?.(current.getMarkdown()),
  })

  const formats = useEditorState({ editor, selector: readFormats })

  return { editor, formats }
}
