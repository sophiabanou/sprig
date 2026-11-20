import { lazy, memo, Suspense, useCallback, useMemo, useState } from 'react'
import { useNoteSelection } from '../../../../hooks/useNoteSelection'
import { useNotes } from '../../../../hooks/useNotes'
import { getToneClass } from '../../../../utils/tones'
import PageHeader from '../../../layout/PageHeader'
import Button from '../../../ui/Button'
import ErrorBoundary from '../../../ui/ErrorBoundary'
import Icon from '../../../ui/Icon'
import ListCard from '../../../ui/ListCard'
import NoteEditorError from '../NoteEditorError'
import NotesSidebar from '../NotesSidebar'
import styles from './NotesPanel.module.css'

const NoteEditor = lazy(() => import('../NoteEditor'))

function NotesPanel() {
  const notes = useNotes()
  const [query, setQuery] = useState('')
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
        <div className={`${styles.workspace} ${getToneClass('lemon')}`} data-view={isEditorOpen ? 'editor' : 'list'}>
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
      )}
    </>
  )
}

export default memo(NotesPanel)
