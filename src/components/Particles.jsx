import { useEffect, useRef } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

// Shades of the site's green
const LIGHT = ['#0b6e3d', '#0e9f6e', '#16c172', '#34d399']
const DARK = ['#16c172', '#34d399', '#6ee7b7', '#a7f3d0']

const SEE = 55 // px a particle can see its neighbours from
const ROOM = 16 // px it tries to keep between itself and the nearest ones
const MIN_SPEED = 1.2
const MAX_SPEED = 3.2

// A swarm: every particle steers toward its neighbours' centre, lines up with their heading
// and keeps a little room, while the whole flock chases one target. The target wanders the
// screen on its own and becomes the pointer whenever it moves.
export default function Particles() {
  const ref = useRef(null)
  const { motion, theme } = usePrefs()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (!motion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const colors = theme === 'dark' ? DARK : LIGHT
    const pointer = { x: 0, y: 0, on: false, idle: 0 }
    let w = 0
    let h = 0
    let t = Math.random() * 100
    let frame = 0
    let flock = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(90, Math.min(320, Math.round((w * h) / 5200)))
      flock = Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2
        return {
          x: w / 2 + (Math.random() - 0.5) * w * 0.6,
          y: h / 2 + (Math.random() - 0.5) * h * 0.6,
          vx: Math.cos(a) * 2,
          vy: Math.sin(a) * 2,
          c: (Math.random() * colors.length) | 0,
        }
      })
    }

    const step = () => {
      t += 0.006
      ctx.clearRect(0, 0, w, h)

      // Follow the pointer while it's moving, otherwise loop lazily around the screen
      if (pointer.on && ++pointer.idle > 180) pointer.on = false
      const tx = pointer.on ? pointer.x : w * (0.5 + 0.34 * Math.sin(t * 1.3))
      const ty = pointer.on ? pointer.y : h * (0.5 + 0.3 * Math.sin(t * 1.9 + 1))
      const pull = pointer.on ? 0.09 : 0.05

      for (let i = 0; i < flock.length; i++) {
        const b = flock[i]
        let n = 0
        let cx = 0
        let cy = 0
        let avx = 0
        let avy = 0
        let sx = 0
        let sy = 0
        for (let j = 0; j < flock.length; j++) {
          if (j === i) continue
          const o = flock[j]
          const dx = o.x - b.x
          const dy = o.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > SEE * SEE) continue
          n++
          cx += o.x
          cy += o.y
          avx += o.vx
          avy += o.vy
          if (d2 < ROOM * ROOM) {
            sx -= dx / (d2 || 1)
            sy -= dy / (d2 || 1)
          }
        }
        let ax = sx * 1.4
        let ay = sy * 1.4
        if (n) {
          ax += (cx / n - b.x) * 0.0025 + (avx / n - b.vx) * 0.05
          ay += (cy / n - b.y) * 0.0025 + (avy / n - b.vy) * 0.05
        }
        const gx = tx - b.x
        const gy = ty - b.y
        const gd = Math.hypot(gx, gy) || 1
        ax += (gx / gd) * pull
        ay += (gy / gd) * pull

        b.vx += ax
        b.vy += ay
        const speed = Math.hypot(b.vx, b.vy) || 1
        const clamped = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed))
        b.vx = (b.vx / speed) * clamped
        b.vy = (b.vy / speed) * clamped
        b.x += b.vx
        b.y += b.vy
      }

      // Each particle is a short dash pointing where it's heading; one path per shade
      ctx.lineCap = 'round'
      ctx.lineWidth = 2.6
      ctx.globalAlpha = 0.9
      const paths = colors.map(() => new Path2D())
      for (const b of flock) {
        paths[b.c].moveTo(b.x - b.vx * 2.2, b.y - b.vy * 2.2)
        paths[b.c].lineTo(b.x, b.y)
      }
      paths.forEach((path, i) => {
        ctx.strokeStyle = colors[i]
        ctx.stroke(path)
      })
      ctx.globalAlpha = 1

      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(step)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.on = true
      pointer.idle = 0
    }
    const onLeave = () => {
      pointer.on = false
    }

    resize()
    start()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [motion, theme])

  return <canvas ref={ref} className="particles" aria-hidden="true" />
}
