import { memo } from 'react'
import styles from './SettingCard.module.css'

/* A titled setting with its control beside it. The title is a label when it names a single control. */
function SettingCard({
  title = null,
  titleId,
  controlId,
  description = null,
  descriptionId,
  control = null,
} = {}) {
  const TitleTag = controlId ? 'label' : 'p'

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <TitleTag
          id={titleId}
          htmlFor={controlId}
          className={`${styles.title} ${controlId ? styles.clickable : ''} textHeading`}
        >
          {title}
        </TitleTag>
        <p id={descriptionId} className={`${styles.description} textBody`}>
          {description}
        </p>
      </div>
      {control}
    </div>
  )
}

export default memo(SettingCard)
