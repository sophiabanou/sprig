import { useMemo } from 'react'
import { groupNotes, matchesNote } from '../utils/notes'
import { useToday } from './useToday'

/* Filters notes by the search text and groups them by pin and date, as the note list shows them */
export function useNoteGroups(notes = [], query = '') {
  const today = useToday()

  return useMemo(() => {
    const matches = query.trim() ? notes.filter((note) => matchesNote(note, query)) : notes
    return { groups: groupNotes(matches, today), matchCount: matches.length }
  }, [notes, query, today])
}
