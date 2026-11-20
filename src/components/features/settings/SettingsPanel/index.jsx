import { memo } from 'react'
import { usePanelReveal } from '../../../../hooks/usePanelReveal'
import PageHeader from '../../../layout/PageHeader'
import HabitLayoutSetting from '../HabitLayoutSetting'
import SettingsSection from '../SettingsSection'
import ThemeSetting from '../ThemeSetting'
import styles from './SettingsPanel.module.css'

function SettingsPanel() {
  const panelRef = usePanelReveal('settings')

  return (
    <>
      <PageHeader
        lead="Your"
        title="settings"
        tone="lilac"
        description="Make the app look and feel the way you like."
      />
      <div ref={panelRef} className={styles.sections}>
        <SettingsSection title="Appearance">
          <ThemeSetting />
        </SettingsSection>
        <SettingsSection title="Habits">
          <HabitLayoutSetting />
        </SettingsSection>
      </div>
    </>
  )
}

export default memo(SettingsPanel)
