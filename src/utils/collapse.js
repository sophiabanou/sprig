/*
  The collapsed state of an item in a flex column with a gap. Height, padding and border close to nothing,
  and a negative margin swallows one gap, so the items around it glide instead of jumping when it mounts or unmounts.
*/
export function getCollapsedState(element) {
  const parent = element.parentElement
  const isOnly = !element.previousElementSibling && !element.nextElementSibling
  const gap = parent && !isOnly ? parseFloat(getComputedStyle(parent).rowGap) || 0 : 0
  const isLast = element.nextElementSibling === null

  return {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: isLast ? -gap : 0,
    marginBottom: isLast ? 0 : -gap,
  }
}

export const COLLAPSE_PROPS = 'height,paddingTop,paddingBottom,borderTopWidth,borderBottomWidth,marginTop,marginBottom,overflow'
