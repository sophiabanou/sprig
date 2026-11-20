import { memo, useCallback } from 'react'
import Button from '../../../ui/Button'
import styles from './NoteEditorError.module.css'

function NoteEditorError() {
  const handleReload = useCallback(() => window.location.reload(), [])

  return (
    <div className={styles.card} role="alert">
      <p className="textHeading">The editor did not load.</p>
      <p className={`${styles.text} textBody`}>Your notes are safe. Reload the page to try again.</p>
      <Button onClick={handleReload}>Reload</Button>
    </div>
  )
}

export default memo(NoteEditorError)
