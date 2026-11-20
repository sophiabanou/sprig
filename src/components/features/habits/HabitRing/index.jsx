import { memo, useCallback, useMemo } from 'react'
import { usePressSquish } from '../../../../hooks/usePressSquish'
import { useRingFill } from '../../../../hooks/useRingFill'
import { getRingSegments } from '../../../../utils/ring'
import Icon from '../../../ui/Icon'
import styles from './HabitRing.module.css'

const VIEW_SIZE = 44
const CENTER = VIEW_SIZE / 2
const RADIUS = 20
const STROKE_WIDTH = 3
const SEGMENT_LIMIT = 12

/* Dash of one path length then a longer gap, so an empty fill shows no end cap at all */
const FILL_DASH = '1 2'

/*
  The habit icon inside a ring that fills one segment per log. Tapping it logs once.
  A single habit toggles instead, and past the segment limit the ring fills as one smooth arc.
  Hover and focus tint the next segment so the ring shows what a tap will fill.
*/
function HabitRing({ name = '', icon = 'leaf', count = 0, target = 1, describedBy, onLog, onToggle } = {}) {
  const ringRef = useRingFill(count)
  const isSingle = target === 1
  const isComplete = count >= target
  const isSegmented = target > 1 && target <= SEGMENT_LIMIT
  const segments = useMemo(
    () => (isSegmented ? getRingSegments({ count: target, center: CENTER, radius: RADIUS }) : []),
    [isSegmented, target],
  )
  const isDisabled = !isSingle && isComplete
  const { buttonRef, targetRef } = usePressSquish(isDisabled)

  const handleClick = useCallback(() => {
    if (isSingle) onToggle?.()
    else if (!isComplete) onLog?.()
  }, [isSingle, isComplete, onLog, onToggle])

  return (
    <button
      ref={buttonRef}
      type="button"
      data-habit-ring
      className={`${styles.ring} ${isComplete ? styles.complete : ''}`}
      aria-label={isSingle ? name : `Log ${name}`}
      aria-pressed={isSingle ? isComplete : undefined}
      aria-disabled={isDisabled}
      aria-describedby={describedBy}
      onClick={handleClick}
    >
      <svg
        ref={ringRef}
        className={styles.svg}
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        {isSegmented ? (
          segments.map((d, index) => (
            <g key={d}>
              <path d={d} className={`${styles.track} ${index === count ? styles.next : ''}`} />
              <path
                d={d}
                pathLength="1"
                strokeDasharray={FILL_DASH}
                strokeDashoffset="1"
                className={styles.fill}
                data-ring-fill
                data-offset={index < count ? 0 : 1}
              />
            </g>
          ))
        ) : (
          <>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              className={`${styles.track} ${isSingle && !isComplete ? styles.next : ''}`}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              pathLength="1"
              strokeDasharray={FILL_DASH}
              strokeDashoffset="1"
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              className={styles.fill}
              data-ring-fill
              data-offset={1 - Math.min(count / target, 1)}
            />
          </>
        )}
      </svg>
      <span ref={targetRef} className={styles.badge}>
        <Icon name={icon} size="lg" />
      </span>
    </button>
  )
}

export default memo(HabitRing)
