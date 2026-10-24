// Shared handle to the active Lenis instance (null when motion is off).
export const scroller = { current: null }

export function scrollToTop() {
  if (scroller.current) scroller.current.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function setScrollLocked(locked) {
  if (scroller.current) {
    if (locked) scroller.current.stop()
    else scroller.current.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
