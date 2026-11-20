import { memo, useId } from 'react'
import { SKY_SCENE } from '../../../../assets/icons/skyScene'
import { useLiftHover } from '../../../../hooks/useLiftHover'
import { useSkySwitch } from '../../../../hooks/useSkySwitch'
import styles from './SkySwitch.module.css'

const { width, height, orb, bite, rays, clouds, stars } = SKY_SCENE

/* The bite clip reaches over the orb outline so the bite can hide it and draw the inner edge of the crescent instead */
const ORB_STROKE = 2
const CLOUD_STROKE = 1.5

/* A day and night switch. Its content is decorative, so it takes its name from the element in labelledBy. */
function SkySwitch({ id = '', isNight = false, labelledBy = undefined, describedBy = undefined, onChange } = {}) {
  const { buttonRef, faceRef, shadowRef } = useLiftHover()
  const clipId = useId()
  useSkySwitch(buttonRef, isNight)

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="switch"
      aria-checked={isNight}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={styles.switch}
      onClick={onChange}
    >
      <span ref={shadowRef} className={styles.shadow} aria-hidden="true" />
      <span ref={faceRef} className={styles.face} aria-hidden="true">
        <svg
          className={styles.scene}
          viewBox={`0 0 ${width} ${height}`}
          strokeWidth={ORB_STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <g className={styles.stars} data-sky="stars">
            {stars.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>
          <g className={styles.clouds} strokeWidth={CLOUD_STROKE} data-sky="clouds">
            {clouds.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>
          <g data-sky="peek">
            <g data-sky="orb">
              <clipPath id={clipId}>
                <circle cx={orb.cx} cy={orb.cy} r={orb.r + ORB_STROKE / 2} />
              </clipPath>
              <g className={styles.rays} data-sky="rays">
                {rays.map((path) => (
                  <path key={path} d={path} />
                ))}
              </g>
              <circle className={styles.orb} cx={orb.cx} cy={orb.cy} r={orb.r} />
              <g clipPath={`url(#${clipId})`}>
                <circle className={styles.bite} data-sky="bite" cx={bite.day.cx} cy={bite.day.cy} r={bite.r} />
              </g>
            </g>
          </g>
        </svg>
      </span>
    </button>
  )
}

export default memo(SkySwitch)
