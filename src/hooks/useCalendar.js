import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addDays, addMonths, fromDateKey, getMonthWeeks, toMonthKey } from '../utils/dates'

const KEY_MOVES = {
  ArrowLeft: (key) => addDays(key, -1),
  ArrowRight: (key) => addDays(key, 1),
  ArrowUp: (key) => addDays(key, -7),
  ArrowDown: (key) => addDays(key, 7),
  Home: (key) => addDays(key, -((fromDateKey(key).getDay() + 6) % 7)),
  End: (key) => addDays(key, 6 - ((fromDateKey(key).getDay() + 6) % 7)),
  PageUp: (key, isShifted) => addMonths(key, isShifted ? -12 : -1),
  PageDown: (key, isShifted) => addMonths(key, isShifted ? 12 : 1),
}

/*
  Keeps the active day of a date grid with a roving tab stop. Arrow keys move by day and week,
  Home and End go to the ends of the week, Page Up and Page Down change month (with Shift, year).
  Days before min are never reached. While the popover is closed the active day returns to the value,
  so the grid always opens on the chosen date.
*/
export function useCalendar({ value = '', min = '', today = '', isOpen = false } = {}) {
  const gridRef = useRef(null)
  const shouldFocusRef = useRef(false)

  const clamp = useCallback((key = '') => (min && key < min ? min : key), [min])
  const restingKey = clamp(value || today)
  const [activeKey, setActiveKey] = useState(restingKey)

  useEffect(() => {
    if (!isOpen) setActiveKey(restingKey)
  }, [isOpen, restingKey])

  useEffect(() => {
    if (!shouldFocusRef.current) return
    shouldFocusRef.current = false
    gridRef.current?.querySelector(`[data-date="${activeKey}"]`)?.focus()
  }, [activeKey])

  const monthKey = toMonthKey(activeKey)
  const weeks = useMemo(() => getMonthWeeks(monthKey), [monthKey])
  const isAtMinMonth = Boolean(min) && monthKey <= toMonthKey(min)

  const handlePreviousMonth = useCallback(() => setActiveKey((key) => clamp(addMonths(key, -1))), [clamp])
  const handleNextMonth = useCallback(() => setActiveKey((key) => addMonths(key, 1)), [])

  const handleKeyDown = useCallback(
    (event) => {
      const move = KEY_MOVES[event.key]
      if (!move || !event.target.dataset.date) return
      event.preventDefault()
      shouldFocusRef.current = true
      setActiveKey((key) => clamp(move(key, event.shiftKey)))
    },
    [clamp],
  )

  return { gridRef, activeKey, monthKey, weeks, isAtMinMonth, handlePreviousMonth, handleNextMonth, handleKeyDown }
}
