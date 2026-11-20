import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { hasErrors } from '../utils/validation'

const NO_ERRORS = {}
/* Buttons cannot carry aria-invalid, so custom pickers like the date field mark themselves with data-invalid */
const INVALID_FIELD = '[aria-invalid="true"], [data-invalid="true"]'

/*
  Errors stay hidden until the first submit, so nobody is scolded before they finish typing.
  After a failed submit they update live as the fields change, and focus moves to the first invalid field,
  where its message is read through aria-describedby.
*/
export function useFormValidation(validate, values = {}) {
  const formRef = useRef(null)
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false)
  const [focusRequest, setFocusRequest] = useState(0)

  const errors = useMemo(
    () => (hasTriedSubmit ? validate(values) : NO_ERRORS),
    [hasTriedSubmit, validate, values],
  )

  useEffect(() => {
    if (focusRequest === 0) return
    formRef.current?.querySelector(INVALID_FIELD)?.focus()
  }, [focusRequest])

  const checkForSubmit = useCallback(() => {
    if (!hasErrors(validate(values))) {
      setHasTriedSubmit(false)
      return true
    }
    setHasTriedSubmit(true)
    setFocusRequest((count) => count + 1)
    return false
  }, [validate, values])

  return { formRef, errors, checkForSubmit }
}
