import { daysBetween, toDateKey } from './dates'

/* The indent, then a heading, checklist, bullet, number or quote marker at the start of a markdown line */
const BLOCK_PREFIX = /^(\s*)(#{1,6}\s*|[-*+]\s+\[[ xX]\]\s+|[-*+]\s+|\d+[.)]\s+|>\s+)?/

const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', { month: 'long' })

function toPlainLine(line = '') {
  return line
    .replace(BLOCK_PREFIX, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`\\]+/g, '')
    .trim()
}

function getPlainLines(body = '') {
  return body.split('\n').map(toPlainLine).filter(Boolean)
}

/* The first line of a note is its title, and the next line with text is its preview */
export function getNoteTitle(body = '') {
  return getPlainLines(body)[0] ?? ''
}

export function getNotePreview(body = '') {
  return getPlainLines(body)[1] ?? ''
}

export function matchesNote(note = {}, query = '') {
  return note.body?.toLowerCase().includes(query.trim().toLowerCase())
}

function getGroup(timestamp = 0, todayKey = toDateKey()) {
  const date = new Date(timestamp)
  const days = daysBetween(toDateKey(date), todayKey)
  if (days <= 0) return { id: 'today', label: 'Today' }
  if (days === 1) return { id: 'yesterday', label: 'Yesterday' }
  if (days < 7) return { id: 'week', label: 'Previous 7 days' }
  if (days < 30) return { id: 'month', label: 'Previous 30 days' }
  if (date.getFullYear() === new Date().getFullYear()) {
    return { id: `month-${date.getMonth()}`, label: MONTH_FORMAT.format(date) }
  }
  return { id: `year-${date.getFullYear()}`, label: String(date.getFullYear()) }
}

/* Pinned notes first, then the rest by when they were last edited, newest first */
export function groupNotes(notes = [], todayKey = toDateKey()) {
  const groups = []
  const pinned = notes.filter((note) => note.isPinned)
  if (pinned.length > 0) groups.push({ id: 'pinned', label: 'Pinned', notes: pinned })

  notes
    .filter((note) => !note.isPinned)
    .forEach((note) => {
      const group = getGroup(note.updatedAt, todayKey)
      const last = groups[groups.length - 1]
      if (last?.id === group.id) last.notes.push(note)
      else groups.push({ ...group, notes: [note] })
    })
  return groups
}
