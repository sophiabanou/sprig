const DAY_MS = 24 * 60 * 60 * 1000

export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(key = '') {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/* Weeks start on Monday. */
export function startOfWeek(date = new Date()) {
  const daysSinceMonday = (date.getDay() + 6) % 7
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysSinceMonday)
}

/* Whole days from one date key to another. Rounding absorbs daylight saving shifts. */
export function daysBetween(fromKey = '', toKey = '') {
  return Math.round((fromDateKey(toKey) - fromDateKey(fromKey)) / DAY_MS)
}

export function msUntilTomorrow(now = new Date()) {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return tomorrow - now
}

export function endOfWeek(date = new Date()) {
  const start = startOfWeek(date)
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('en-GB', { weekday: 'long' })
const SHORT_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/* Friendly due text: today, tomorrow, a weekday within the next 6 days, or a short date. */
export function formatDueLabel(dueKey = '', todayKey = toDateKey()) {
  const days = daysBetween(todayKey, dueKey)
  const date = fromDateKey(dueKey)
  if (days < 0) return `Was due ${SHORT_DATE_FORMAT.format(date)}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days < 7) return `Due ${WEEKDAY_FORMAT.format(date)}`
  return `Due ${SHORT_DATE_FORMAT.format(date)}`
}

/* Note dates */

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })
const NUMERIC_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })
const STAMP_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/* The stamp above a note, for example 21 November 2026 at 10:42 */
export function formatNoteStamp(timestamp = 0) {
  const date = new Date(timestamp)
  return `${STAMP_DATE_FORMAT.format(date)} at ${TIME_FORMAT.format(date)}`
}

/* The date in the note list: the time today, the weekday within a week, the full date after that */
export function formatNoteListDate(timestamp = 0, todayKey = toDateKey()) {
  const date = new Date(timestamp)
  const days = daysBetween(toDateKey(date), todayKey)
  if (days === 0) return TIME_FORMAT.format(date)
  if (days === 1) return 'Yesterday'
  if (days < 7) return WEEKDAY_FORMAT.format(date)
  return NUMERIC_DATE_FORMAT.format(date)
}

/* Calendar helpers */

const CALENDAR_DAYS = 42
const FULL_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const FIELD_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })

export const WEEKDAYS = [
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
  { short: 'Su', long: 'Sunday' },
]

export function addDays(key = '', amount = 0) {
  const date = fromDateKey(key)
  return toDateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount))
}

/* Moves by whole months and keeps the day, clamped to the last day of a shorter month. */
export function addMonths(key = '', amount = 0) {
  const date = fromDateKey(key)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate()
  return toDateKey(new Date(date.getFullYear(), date.getMonth() + amount, Math.min(date.getDate(), lastDay)))
}

export function toMonthKey(key = '') {
  return key.slice(0, 7)
}

/* Six weeks from Monday, so the grid keeps one height. Days outside the month are null. */
export function getMonthWeeks(monthKey = '') {
  const [year, month] = monthKey.split('-').map(Number)
  const leadingDays = (new Date(year, month - 1, 1).getDay() + 6) % 7
  const dayCount = new Date(year, month, 0).getDate()
  const cells = Array.from({ length: CALENDAR_DAYS }, (_, index) => {
    const day = index - leadingDays + 1
    return day >= 1 && day <= dayCount ? toDateKey(new Date(year, month - 1, day)) : null
  })
  return Array.from({ length: CALENDAR_DAYS / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
}

export function formatFullDate(key = '') {
  return FULL_DATE_FORMAT.format(fromDateKey(key))
}

export function formatFieldDate(key = '') {
  return FIELD_DATE_FORMAT.format(fromDateKey(key))
}

export function formatMonth(monthKey = '') {
  return MONTH_FORMAT.format(fromDateKey(`${monthKey}-01`))
}
