// Eases the page background toward a project's colour while its row is hovered or focused.
export function setTint(color) {
  const root = document.documentElement
  if (color) {
    root.style.setProperty('--tint', color)
    root.dataset.tint = 'on'
  } else {
    root.removeAttribute('data-tint')
  }
}
