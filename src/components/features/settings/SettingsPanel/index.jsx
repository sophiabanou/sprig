import { memo } from 'react'
import { usePanelReveal } from '../../../../hooks/usePanelReveal'
import PageHeader from '../../../layout/PageHeader'
import SettingsSection from '../SettingsSection'
import ThemeSetting from '../ThemeSetting'

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
      <div ref={panelRef}>
        <SettingsSection title="Appearance">
          <ThemeSetting />
        </SettingsSection>
      </div>
    </>
  )
}

export default memo(SettingsPanel)
