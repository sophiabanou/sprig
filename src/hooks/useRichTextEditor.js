import { useLayoutEffect, useRef } from 'react'
import { Extension, mergeAttributes } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'

const HEADING_LEVELS = [1, 2, 3]

/*
  Level 1 is the note title. Headings sit under the page title, so level 1 renders as h2 and so on,
  keeping the heading order. Their size comes from the typography utilities.
*/
const HEADING_OFFSET = 1
const HEADING_CLASSES = { 1: 'textTitle', 2: 'textHeadingBold', 3: 'textHeading' }

/*
  As in Apple Notes, a note always starts with its title. The trailing line the editor keeps at the end
  would otherwise take the first allowed type, a heading, so it is set to a paragraph.
*/
const TitledDocument = Document.extend({ content: 'heading block*' })

/*
  Enter in the title never makes a second title: the text after the cursor moves down into a normal line,
  and the cursor goes with it.
*/
const TitleEnter = Extension.create({
  name: 'titleEnter',
  priority: 1000,
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) =>
        editor.commands.command(({ tr, state }) => {
          const { $from, $to } = tr.selection
          if ($from.depth !== 1 || $from.index(0) !== 0 || $to.index(0) !== 0) return false

          tr.deleteSelection()
          const cursor = tr.selection.from
          const titleEnd = tr.doc.firstChild.nodeSize - 1
          const rest = tr.doc.firstChild.content.cut(cursor - 1)
          const next = tr.doc.maybeChild(1)
          tr.delete(cursor, titleEnd)

          const lineStart = tr.doc.firstChild.nodeSize
          const isNextEmptyLine = rest.size === 0 && next?.type.name === 'paragraph' && next.content.size === 0
          if (!isNextEmptyLine) tr.insert(lineStart, state.schema.nodes.paragraph.create(null, rest))
          tr.setSelection(TextSelection.create(tr.doc, lineStart + 1)).scrollIntoView()
          return true
        }),
    }
  },
})

const StyledHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = HEADING_LEVELS.includes(node.attrs.level) ? node.attrs.level : HEADING_LEVELS[0]
    return [`h${level + HEADING_OFFSET}`, mergeAttributes(HTMLAttributes, { class: HEADING_CLASSES[level] }), 0]
  },
}).configure({ levels: HEADING_LEVELS })

/*
  A rich text editor with no toolbar that reads and writes markdown, so notes stay plain markdown in
  storage. The first line is always the title. Markdown typed in turns into formatting right away (## for
  a heading, - for a list, [ ] for a checklist), along with the usual shortcuts for bold and italic, and
  Cmd or Ctrl K asks for a link. The text is read once on mount, so remount the editor (with a key) to
  show another note.
*/
export function useRichTextEditor({
  initialValue = '',
  label = '',
  titlePlaceholder = '',
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

  return useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        heading: false,
        code: false,
        codeBlock: false,
        underline: false,
        trailingNode: { node: 'paragraph' },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      TitledDocument,
      TitleEnter,
      StyledHeading,
      TaskList,
      TaskItem.configure({
        nested: true,
        a11y: { checkboxLabel: (node) => node.textContent || 'Empty checklist item' },
      }),
      Placeholder.configure({
        showOnlyCurrent: false,
        placeholder: ({ pos }) => (pos === 0 ? titlePlaceholder : ''),
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
    onUpdate: ({ editor }) => onChangeRef.current?.(editor.getMarkdown()),
  })
}
