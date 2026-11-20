import { memo, useCallback, useMemo, useState } from 'react'
import { useFormDrawer } from '../../../../hooks/useFormDrawer'
import { useHabitDelete } from '../../../../hooks/useHabitDelete'
import { useHabitGroups } from '../../../../hooks/useHabitGroups'
import { HABIT_FREQUENCY } from '../../../../store/useHabitStore'
import PageHeader from '../../../layout/PageHeader'
import Button from '../../../ui/Button'
import Drawer from '../../../ui/Drawer'
import Icon from '../../../ui/Icon'
import IconButton from '../../../ui/IconButton'
import Tabs from '../../../ui/Tabs'
import HabitForm from '../HabitForm'
import HabitGroup from '../HabitGroup'

const HABIT_TABS = [
  { id: HABIT_FREQUENCY.DAILY, label: 'Daily', tone: 'peach' },
  { id: HABIT_FREQUENCY.WEEKLY, label: 'Weekly', tone: 'lilac' },
]

function HabitsPanel() {
  const { daily, weekly } = useHabitGroups()
  const { isOpen, formKey, handleOpen, handleClose, handleClosed, closeWithMessage } = useFormDrawer()
  const { headingRef, handleDelete } = useHabitDelete()
  const [activeTab, setActiveTab] = useState(HABIT_FREQUENCY.DAILY)
  const [editingHabit, setEditingHabit] = useState(null)
  const isDaily = activeTab === HABIT_FREQUENCY.DAILY

  const handleNew = useCallback(() => {
    setEditingHabit(null)
    handleOpen()
  }, [handleOpen])

  const handleEdit = useCallback(
    (habit = {}) => {
      setEditingHabit(habit)
      handleOpen()
    },
    [handleOpen],
  )

  const handleSave = useCallback(
    (habit = {}) => {
      setActiveTab(habit.frequency)
      closeWithMessage(`Habit updated: ${habit.name}`)
    },
    [closeWithMessage],
  )

  const handleAdd = useCallback(
    (habit = {}) => {
      setActiveTab(habit.frequency)
      closeWithMessage(`Habit added: ${habit.name.trim()}`)
    },
    [closeWithMessage],
  )

  const newHabitButton = useMemo(
    () => (
      <Button onClick={handleNew}>
        <Icon name="plus" size="sm" />
        New habit
      </Button>
    ),
    [handleNew],
  )

  const closeButton = useMemo(
    () => <IconButton label="Close" icon="close" onClick={handleClose} />,
    [handleClose],
  )

  return (
    <>
      <PageHeader
        lead="Your"
        title="habits"
        tone="peach"
        description="Small things, every day or every week."
        headingRef={headingRef}
        action={newHabitButton}
      />
      <Tabs label="Habit frequency" tabs={HABIT_TABS} activeId={activeTab} onChange={setActiveTab}>
        {isDaily ? (
          <HabitGroup
            title="Today"
            illustration="sun"
            tone="peach"
            emptyTitle="A blank day."
            emptyText="Plant a daily habit and watch it grow."
            habits={daily}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <HabitGroup
            title="This week"
            illustration="week"
            tone="lilac"
            emptyTitle="A quiet week."
            emptyText="Add a weekly habit to give it some rhythm."
            habits={weekly}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Tabs>
      <Drawer label={editingHabit ? 'Edit habit' : 'New habit'} isOpen={isOpen} onClose={handleClose} onClosed={handleClosed}>
        <HabitForm
          key={formKey}
          habit={editingHabit}
          initialFrequency={activeTab}
          onAdd={handleAdd}
          onSave={handleSave}
          headerAction={closeButton}
        />
      </Drawer>
    </>
  )
}

export default memo(HabitsPanel)
