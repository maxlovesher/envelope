import { useEffect, useRef } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

// Same order as --c1…--c6 in index.css
const COLORS = ['#ff4fa3', '#ff8a3d', '#ffcf3f', '#2fd9b0', '#4f7bff', '#a46bff']
const REACH = 160 // px around the pointer that particles get swept by

// Particles drifting along a slowly turning flow behind the whole site. Each leaves a short
// trail that fades out; near the pointer they swirl around it and get carried along.
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

    const dark = theme === 'dark'
    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0 }
    let w = 0
    let h = 0
    let t = Math.random() * 100
    let frame = 0
    let parts = []

    const spawn = (p = {}) => {
      p.x = Math.random() * w
      p.y = Math.random() * h
      p.life = 120 + Math.random() * 360
      p.c = (Math.random() * COLORS.length) | 0
      p.s = 0.5 + Math.random() * 1.1
      return p
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      parts = Array.from({ length: Math.min(900, Math.round((w * h) / 1700)) }, () => spawn())
    }

    // A few overlapping waves make a field that bends and drifts without repeating soon
    const angle = (x, y) =>
      Math.sin(x * 0.0021 + t * 0.25) * 1.6 +
      Math.cos(y * 0.0017 - t * 0.18) * 1.6 +
      Math.sin((x + y) * 0.0009 + t * 0.11) * 1.2

    const step = () => {
      t += 0.01

      // Thin the previous frame out toward transparent, which is what leaves the trails
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
      ctx.globalAlpha = dark ? 0.75 : 0.6
      ctx.lineCap = 'round'

      // One path per colour keeps it to six strokes a frame
      const paths = COLORS.map(() => new Path2D())
      for (const p of parts) {
        const a = angle(p.x, p.y)
        let vx = Math.cos(a) * p.s
        let vy = Math.sin(a) * p.s
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < REACH * REACH) {
          const f = 1 - Math.sqrt(d2) / REACH
          vx += (-dy * 0.02 + dx * 0.008 + pointer.vx * 0.25) * f
          vy += (dx * 0.02 + dy * 0.008 + pointer.vy * 0.25) * f
        }
        const ox = p.x
        const oy = p.y
        p.x += vx
        p.y += vy
        if (--p.life < 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          spawn(p)
          continue
        }
        paths[p.c].moveTo(ox, oy)
        paths[p.c].lineTo(p.x, p.y)
      }
      paths.forEach((path, i) => {
        ctx.strokeStyle = COLORS[i]
        ctx.lineWidth = 1 + (i % 3) * 0.5
        ctx.stroke(path)
      })
      ctx.globalAlpha = 1

      pointer.vx *= 0.9
      pointer.vy *= 0.9
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
      if (pointer.x > -1e4) {
        pointer.vx = e.clientX - pointer.x
        pointer.vy = e.clientY - pointer.y
      }
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    const onLeave = () => {
      pointer.x = -1e4
      pointer.y = -1e4
    }

    resize()
    ctx.clearRect(0, 0, w, h)
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
