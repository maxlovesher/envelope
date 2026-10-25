import { useEffect, useRef, useState } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

// A giant condensed headline. Each line's letters flip in when it scrolls into view;
// `filled` lines are solid accent, the rest are outlined. With `stretch`, the lines grow
// taller (up to that scale) as the headline scrolls up the screen.
export default function BigType({ lines, filled = [0], as: Tag = 'h2', className = '', stretch = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  const { motion } = usePrefs()

  useEffect(() => {
    const el = ref.current
    if (!stretch || !motion) {
      el.style.removeProperty('--s')
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - el.getBoundingClientRect().top) / (vh * 0.9)))
      el.style.setProperty('--s', (1 + p * (stretch - 1)).toFixed(3))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [stretch, motion])

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  let n = 0
  return (
    <Tag ref={ref} className={`bigtype${shown ? ' in' : ''}${stretch ? ' stretch' : ''} ${className}`} aria-label={lines.join(' ')}>
      {lines.map((line, i) => (
        <span key={line} className={`bigtype-line${filled.includes(i) ? ' filled' : ''}`} aria-hidden="true">
          {[...line].map((ch, j) => (
            <span key={j} className="ch" style={{ '--i': n++ }}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
