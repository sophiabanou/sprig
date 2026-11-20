import { memo, useId } from 'react'
import { useThemeStore } from '../../../../store/useThemeStore'
import TypewriterText from '../../../ui/TypewriterText'
import SkySwitch from '../SkySwitch'
import styles from './ThemeSetting.module.css'

/* Each text is split into parts, and only the parts that differ are retyped */
const COPY = {
  light: {
    title: ['Light', ' mode'],
    description: ['The ', 'sun', ' is out. ', 'Bright and clear for the day.'],
  },
  dark: {
    title: ['Dark', ' mode'],
    description: ['The ', 'moon', ' is out. ', 'Calm and cozy for the night.'],
  },
}

/* The description is longer, so it types faster and starts just after the title */
const DESCRIPTION_SPEED = 0.6
const DESCRIPTION_DELAY = 0.15

function ThemeSetting() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const controlId = useId()
  const titleId = useId()
  const descriptionId = useId()
  const isDark = theme === 'dark'
  const copy = isDark ? COPY.dark : COPY.light

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <label id={titleId} htmlFor={controlId} className={`${styles.title} textHeading`}>
          <TypewriterText parts={copy.title} />
        </label>
        <p id={descriptionId} className={`${styles.description} textBody`}>
          <TypewriterText parts={copy.description} delay={DESCRIPTION_DELAY} speed={DESCRIPTION_SPEED} />
        </p>
      </div>
      <SkySwitch id={controlId} isNight={isDark} labelledBy={titleId} describedBy={descriptionId} onChange={toggleTheme} />
    </div>
  )
}

export default memo(ThemeSetting)
