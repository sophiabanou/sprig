import { memo, useId } from 'react'
import { HABIT_LAYOUT, useSettingsStore } from '../../../../store/useSettingsStore'
import SegmentedControl from '../../../ui/SegmentedControl'
import SettingCard from '../SettingCard'

const LAYOUT_OPTIONS = [
  { value: HABIT_LAYOUT.RINGS, label: 'Rings' },
  { value: HABIT_LAYOUT.SIMPLE, label: 'Simple' },
]

const TITLE = 'Habit layout'

function HabitLayoutSetting() {
  const habitLayout = useSettingsStore((state) => state.habitLayout)
  const setHabitLayout = useSettingsStore((state) => state.setHabitLayout)
  const descriptionId = useId()

  return (
    <SettingCard
      title={TITLE}
      description="Rings show each habit's icon and fill up as you tap it to log. Simple uses a checkbox or a small log pill."
      descriptionId={descriptionId}
      control={
        <SegmentedControl
          legend={TITLE}
          isLegendHidden
          describedBy={descriptionId}
          name="habit-layout"
          options={LAYOUT_OPTIONS}
          value={habitLayout}
          onChange={setHabitLayout}
        />
      }
    />
  )
}

export default memo(HabitLayoutSetting)
