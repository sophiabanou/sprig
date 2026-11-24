import AppShell from './components/layout/AppShell'
import LiveRegion from './components/layout/LiveRegion'
import Toast from './components/layout/Toast'
import HabitsPanel from './components/features/habits/HabitsPanel'
import TasksPanel from './components/features/tasks/TasksPanel'
import NotesPanel from './components/features/notes/NotesPanel'
import WorkPanel from './components/features/work/WorkPanel'
import SettingsPanel from './components/features/settings/SettingsPanel'
import { useApplyTheme } from './hooks/useApplyTheme'
import { ROUTES, useRoute } from './hooks/useRoute'
import { useRouteFocus } from './hooks/useRouteFocus'

const PANELS = {
  [ROUTES.HABITS]: HabitsPanel,
  [ROUTES.TASKS]: TasksPanel,
  [ROUTES.NOTES]: NotesPanel,
  [ROUTES.WORK]: WorkPanel,
  [ROUTES.SETTINGS]: SettingsPanel,
}

const FULL_HEIGHT_ROUTES = [ROUTES.NOTES, ROUTES.WORK]

export default function App() {
  useApplyTheme()
  const route = useRoute()
  const mainRef = useRouteFocus(route)
  const Panel = PANELS[route] ?? HabitsPanel

  return (
    <>
      <AppShell route={route} mainRef={mainRef} isFullHeight={FULL_HEIGHT_ROUTES.includes(route)}>
        <Panel />
      </AppShell>
      <Toast />
      <LiveRegion />
    </>
  )
}
