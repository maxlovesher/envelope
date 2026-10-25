import { useEffect, useRef, useState } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

const INTERACTIVE = 'a, button, [data-cursor], [tabindex]:not([tabindex="-1"])'

// A circle that inverts whatever is under it (mix-blend-mode: difference) and trails the normal pointer.
// It grows over links and buttons and shows the nearest data-cursor label. Fine pointers only.
export default function Cursor() {
  const { motion } = usePrefs()
  const ref = useRef(null)
  const [enabled] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const [state, setState] = useState({ hover: false, label: '', down: false, hidden: true })

  useEffect(() => {
    if (!enabled) return
    const el = ref.current

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let frame = 0
    const ease = motion ? 0.2 : 1

    const loop = () => {
      pos.x += (target.x - pos.x) * ease
      pos.y += (target.y - pos.y) * ease
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      const hit = e.target.closest?.(INTERACTIVE)
      const label = e.target.closest?.('[data-cursor]')?.dataset.cursor ?? ''
      setState((s) =>
        s.hover === !!hit && s.label === label && !s.hidden ? s : { ...s, hover: !!hit, label, hidden: false },
      )
    }
    const onLeave = () => setState((s) => ({ ...s, hidden: true }))
    const onDown = () => setState((s) => ({ ...s, down: true }))
    const onUp = () => setState((s) => ({ ...s, down: false }))

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled, motion])

  if (!enabled) return null

  const cls = ['cursor', state.hover && 'hover', state.label && 'labelled', state.down && 'down', state.hidden && 'hidden']
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className="cursor-wrap" aria-hidden="true">
      <div className={cls}>
        <span>{state.label}</span>
      </div>
    </div>
  )
}
