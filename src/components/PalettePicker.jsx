import { useEffect, useRef, useState } from 'react'
import { BRIGHTS, DEFAULT_PALETTE, PALETTES, paletteById, palettesWith } from '../lib/palettes.js'
import { usePrefs } from '../lib/prefs-context.js'

// The current green leads the swatches so the default look can be found again
const SWATCHES = [paletteById(DEFAULT_PALETTE).main, ...BRIGHTS]

// Colours panel: pick a colour to see the palettes that use it, then pick a palette to apply it.
export default function PalettePicker({ open, onClose, triggerRef }) {
  const { palette, setPalette } = usePrefs()
  const [picked, setPicked] = useState(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || triggerRef.current?.contains(e.target)) return
      onClose()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, onClose, triggerRef])

  const options = picked ? palettesWith(picked) : PALETTES

  return (
    <div
      ref={panelRef}
      className={`palette-panel${open ? ' open' : ''}`}
      role="dialog"
      aria-label="Colours"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="palette-head">
        <span className="label">Colours</span>
        <div className="palette-head-actions">
          <button type="button" className="pill" onClick={() => setPalette(DEFAULT_PALETTE)}>
            Reset
          </button>
          <button type="button" className="pill" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <p className="palette-step">1 · Pick a colour</p>
      <div className="swatch-grid" role="group" aria-label="Colours">
        {SWATCHES.map((hex) => (
          <button
            key={hex}
            type="button"
            className={`swatch-btn${picked === hex ? ' on' : ''}`}
            style={{ '--sw': hex }}
            aria-label={hex}
            aria-pressed={picked === hex}
            title={hex}
            onClick={() => setPicked(picked === hex ? null : hex)}
          />
        ))}
      </div>

      <p className="palette-step">
        2 · Choose a palette
        <span>{picked ? `${options.length} with ${picked}` : `all ${PALETTES.length}`}</span>
      </p>
      <ul className="palette-list">
        {options.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`palette-option${palette === p.id ? ' on' : ''}`}
              aria-pressed={palette === p.id}
              onClick={() => setPalette(p.id)}
            >
              <span className="palette-strip" aria-hidden="true">
                {[p.ink, ...p.colors].map((c, i) => (
                  <i key={i} style={{ background: c }} />
                ))}
              </span>
              <span className="palette-name">{p.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="palette-note">Saved in this browser.</p>
    </div>
  )
}
