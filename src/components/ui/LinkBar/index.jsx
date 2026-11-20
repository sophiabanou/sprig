import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Button from '../Button'
import IconButton from '../IconButton'
import TextField from '../TextField'
import styles from './LinkBar.module.css'

/* Adds, changes or removes a link. Esc or Close leaves without changes. */
function LinkBar({ initialUrl = '', hasLink = false, onApply, onRemove, onClose } = {}) {
  const [url, setUrl] = useState(initialUrl)
  const formRef = useRef(null)

  useEffect(() => {
    formRef.current?.querySelector('input')?.focus()
  }, [])

  const handleChange = useCallback((event) => setUrl(event.target.value), [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      onApply?.(url.trim())
    },
    [url, onApply],
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose?.()
    },
    [onClose],
  )

  return (
    <form ref={formRef} className={styles.bar} aria-label="Link" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <div className={styles.field}>
        <TextField label="Link address" type="url" value={url} onChange={handleChange} />
      </div>
      <div className={styles.actions}>
        <Button type="submit">Apply</Button>
        {hasLink && (
          <Button variant="secondary" onClick={onRemove}>
            Remove link
          </Button>
        )}
        <IconButton label="Close" icon="close" onClick={onClose} />
      </div>
    </form>
  )
}

export default memo(LinkBar)
