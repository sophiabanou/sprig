import { lazy, memo, Suspense, useCallback, useId, useMemo, useState } from 'react'
import { useNoteSelection } from '../../../../hooks/useNoteSelection'
import { usePanelReveal } from '../../../../hooks/usePanelReveal'
import { useNotes } from '../../../../hooks/useNotes'
import { countNotes } from '../../../../utils/notes'
import { getToneClass } from '../../../../utils/tones'
import PageHeader from '../../../layout/PageHeader'
import Button from '../../../ui/Button'
import ErrorBoundary from '../../../ui/ErrorBoundary'
import Icon from '../../../ui/Icon'
import ListCard from '../../../ui/ListCard'
import ListHeader from '../../../ui/ListHeader'
import NoteEditorError from '../NoteEditorError'
import NotesSidebar from '../NotesSidebar'
import styles from './NotesPanel.module.css'

const NoteEditor = lazy(() => import('../NoteEditor'))

/* The empty state and the notes share the Notes heading, so switching between them only moves the content */
const PANEL_REVEAL = { hasSharedHeading: true }

function NotesPanel() {
  const notes = useNotes()
  const [query, setQuery] = useState('')
  const listHeadingId = useId()
  const {
    headingRef,
    listRef,
    selectedNote,
    currentId,
    isEditorOpen,
    autoFocusId,
    handleNew,
    handleSelect,
    handleBack,
    handleDeleteNote,
  } = useNoteSelection(notes)

  /* A new note is blank, so the search is cleared to keep it in the list */
  const handleNewNote = useCallback(() => {
    setQuery('')
    handleNew()
  }, [handleNew])

  const newNoteButton = useMemo(
    () => (
      <Button onClick={handleNewNote}>
        <Icon name="plus" size="sm" />
        New note
      </Button>
    ),
    [handleNewNote],
  )

  const isEmpty = notes.length === 0
  const panelRef = usePanelReveal(isEmpty ? 'empty' : 'notes', PANEL_REVEAL)

  return (
    <>
      <PageHeader
        lead="Your"
        title="notes"
        tone="lemon"
        description="Thoughts, lists and anything worth keeping."
        headingRef={headingRef}
        action={newNoteButton}
      />
      <div ref={panelRef} className={styles.panel}>
        {isEmpty ? (
          <ListCard
            title="Notes"
            illustration="notepad"
            tone="lemon"
            emptyTitle="A blank page."
            emptyText="Write down anything you want to keep."
            isEmpty
          />
        ) : (
          <section className={`${styles.section} ${getToneClass('lemon')}`} aria-labelledby={listHeadingId}>
            <ListHeader id={listHeadingId} title="Notes" illustration="notepad" meta={countNotes(notes.length)} />
            <div className={styles.workspace} data-view={isEditorOpen ? 'editor' : 'list'} data-reveal="list-body">
              <NotesSidebar
                notes={notes}
                selectedId={currentId}
                query={query}
                listRef={listRef}
                onQueryChange={setQuery}
                onSelect={handleSelect}
              />
              <div className={styles.editor}>
                <ErrorBoundary fallback={<NoteEditorError />}>
                  <Suspense fallback={null}>
                    <NoteEditor
                      key={selectedNote.id}
                      note={selectedNote}
                      isAutoFocused={autoFocusId === selectedNote.id}
                      onBack={handleBack}
                      onDelete={handleDeleteNote}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default memo(NotesPanel)
