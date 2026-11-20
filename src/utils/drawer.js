/* Reads where the drawer panel sits when hidden, as percentages of its size. The CSS sets it, so the same code drives the side drawer and the bottom sheet. */
export function getDrawerOffscreen(panel) {
  const panelStyles = getComputedStyle(panel)
  return {
    xPercent: parseFloat(panelStyles.getPropertyValue('--drawer-from-x')) || 0,
    yPercent: parseFloat(panelStyles.getPropertyValue('--drawer-from-y')) || 0,
  }
}
