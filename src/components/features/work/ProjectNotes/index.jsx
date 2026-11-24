import { lazy, memo, Suspense } from 'react'
import ErrorBoundary from '../../../ui/ErrorBoundary'
import NoteEditorError from '../../notes/NoteEditorError'
import ProjectNoteList from '../ProjectNoteList'
import styles from './ProjectNotes.module.css'

const NoteEditor = lazy(() => import('../../notes/NoteEditor'))

/* The note list, or one open note in its place with a way back. A note that is gone shows nothing while the view changes. */
function ProjectNotes({
  projectId = '',
  notes = [],
  openNoteId = null,
  rootRef = null,
  listRef = null,
  autoFocusId = null,
  onSelect,
  onBack,
  onDelete,
} = {}) {
  const openNote = openNoteId ? notes.find((note) => note.id === openNoteId) : null

  return (
    <div ref={rootRef} className={openNoteId ? styles.filling : undefined}>
      {!openNoteId && <ProjectNoteList notes={notes} projectId={projectId} listRef={listRef} onSelect={onSelect} />}
      {openNote && (
        <div className={styles.editor}>
          <ErrorBoundary fallback={<NoteEditorError />}>
            <Suspense fallback={null}>
              <NoteEditor
                key={openNote.id}
                note={openNote}
                isAutoFocused={autoFocusId === openNote.id}
                isBackShown
                onBack={onBack}
                onDelete={onDelete}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}

export default memo(ProjectNotes)
