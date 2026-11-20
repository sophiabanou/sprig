import { memo } from 'react'
import { useCompletedHabitCount } from '../../../../hooks/useCompletedHabitCount'
import ListCard from '../../../ui/ListCard'
import HabitRow from '../HabitRow'

function HabitGroup({
  title = '',
  illustration = '',
  tone = 'lilac',
  emptyTitle = '',
  emptyText = '',
  habits = [],
  onEdit,
  onDelete,
} = {}) {
  const completedCount = useCompletedHabitCount(habits)
  const hasHabits = habits.length > 0
  const isComplete = hasHabits && completedCount === habits.length
  const progressText = isComplete ? 'All done' : `${completedCount} of ${habits.length} done`

  return (
    <ListCard
      title={title}
      illustration={illustration}
      tone={tone}
      meta={hasHabits ? progressText : ''}
      isComplete={isComplete}
      emptyTitle={emptyTitle}
      emptyText={emptyText}
      isEmpty={!hasHabits}
    >
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ListCard>
  )
}

export default memo(HabitGroup)
