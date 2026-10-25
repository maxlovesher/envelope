import { useEffect, useRef } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

// Grid distortion, as on wonjyou.com's hero: the image is split into square cells that each
// carry an offset. Moving the pointer pushes the offsets of nearby cells along with it, and
// every frame they relax back toward zero, so blocks of the picture smear and then settle.
// The offsets start scrambled, so the picture also assembles itself on load.
// Each cell moves as one block, so a 2D canvas reproduces the original WebGL shader exactly.
const GRID = 44 // cells across
const RADIUS = 0.1 // reach of the pointer, as a share of the grid
const STRENGTH = 16 // how hard pointer speed pushes the cells
const RELAX = 0.94 // share of each offset kept per frame
const SHIFT = 0.02 // one offset unit, as a share of the image width

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export default function Distort({ src, alt, className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const { motion } = usePrefs()

  useEffect(() => {
    const el = wrapRef.current
    const canvas = canvasRef.current
    const img = el.querySelector('img')
    const ctx = canvas.getContext('2d')
    if (!motion || !ctx) return

    const source = document.createElement('canvas')
    const mouse = { x: -1, y: -1, vx: 0, vy: 0, px: null, py: null }
    let w = 0
    let h = 0
    let cell = 0
    let cols = 0
    let rows = 0
    let off = new Float32Array(0)
    let frame = 0

    const setup = (scramble) => {
      const r = el.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.round(r.width * dpr)
      h = Math.round(r.height * dpr)
      if (!w || !h) return
      canvas.width = source.width = w
      canvas.height = source.height = h
      source.getContext('2d').drawImage(img, 0, 0, w, h)
      cols = GRID
      cell = Math.ceil(w / cols)
      rows = Math.ceil(h / cell)
      off = new Float32Array(cols * rows * 2)
      if (scramble) for (let i = 0; i < off.length; i++) off[i] = Math.random() * 10 - 5
      draw()
      // Hide the plain img only once the canvas has something on it
      el.classList.add('ready')
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const shift = SHIFT * w
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 2
          const dx = x * cell
          const dy = y * cell
          const cw = Math.min(cell, w - dx)
          const ch = Math.min(cell, h - dy)
          if (cw <= 0 || ch <= 0) continue
          const sx = clamp(dx - off[i] * shift, 0, w - cw)
          const sy = clamp(dy - off[i + 1] * shift, 0, h - ch)
          ctx.drawImage(source, sx, sy, cw, ch, dx, dy, cw, ch)
        }
      }
    }

    const step = () => {
      let energy = 0
      for (let i = 0; i < off.length; i++) {
        off[i] *= RELAX
        energy += Math.abs(off[i])
      }
      if (mouse.x >= 0) {
        const mx = mouse.x * cols
        const my = mouse.y * rows
        const reach = cols * RADIUS
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const d2 = (mx - x) ** 2 + (my - y) ** 2
            if (d2 >= reach * reach) continue
            const f = clamp(reach / Math.sqrt(d2), 0, 10)
            const i = (y * cols + x) * 2
            off[i] += STRENGTH * mouse.vx * f
            off[i + 1] += STRENGTH * mouse.vy * f
          }
        }
      }
      mouse.vx *= 0.9
      mouse.vy *= 0.9

      draw()
      // Sleep once everything has settled; the next pointer move wakes it up
      if (energy / off.length < 0.002 && Math.abs(mouse.vx) + Math.abs(mouse.vy) < 1e-4) {
        off.fill(0)
        draw()
        frame = 0
        return
      }
      frame = requestAnimationFrame(step)
    }

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(step)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      const near = x > -0.1 && x < 1.1 && y > -0.1 && y < 1.1
      mouse.x = near ? x : -1
      mouse.y = y
      if (mouse.px !== null) {
        mouse.vx = (e.clientX - mouse.px) / window.innerWidth
        mouse.vy = (e.clientY - mouse.py) / window.innerHeight
      }
      mouse.px = e.clientX
      mouse.py = e.clientY
      if (near) wake()
    }

    const start = () => {
      setup(true)
      wake()
    }
    if (img.complete && img.naturalWidth) start()
    else img.addEventListener('load', start, { once: true })

    const ro = new ResizeObserver(() => {
      if (w) setup(false)
    })
    ro.observe(el)
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      img.removeEventListener('load', start)
      window.removeEventListener('pointermove', onMove)
      el.classList.remove('ready')
    }
  }, [motion])

  return (
    <div ref={wrapRef} className={`distort ${className}`} data-cursor="Drag">
      <img src={src} alt={alt} />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
