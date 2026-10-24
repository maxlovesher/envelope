import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefs } from '../lib/prefs-context.js'

const SEEN = 'intro-seen'

// Short counter shown once per visit on the home and projects pages. Click or any key skips it.
function shouldShow(pathname, motion) {
  if (!motion || (pathname !== '/' && pathname !== '/projects')) return false
  try {
    return !sessionStorage.getItem(SEEN)
  } catch {
    return false
  }
}

export default function Intro() {
  const { motion } = usePrefs()
  const { pathname } = useLocation()
  const [phase, setPhase] = useState(() => (shouldShow(pathname, motion) ? 'count' : 'done'))
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (phase !== 'count') return
    try {
      sessionStorage.setItem(SEEN, '1')
    } catch {
      // storage blocked: the intro may show again next visit
    }
    const start = performance.now()
    let frame = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1100)
      setCount(Math.round(100 * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
      else setPhase('leave')
    }
    const skip = () => setPhase('leave')
    frame = requestAnimationFrame(tick)
    window.addEventListener('keydown', skip)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', skip)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'leave') return
    const id = setTimeout(() => setPhase('done'), 800)
    return () => clearTimeout(id)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      className={`intro${phase === 'leave' ? ' leave' : ''}`}
      onClick={() => setPhase('leave')}
      aria-hidden="true"
    >
      <span className="intro-name">maxlovesher</span>
      <span className="intro-count">{String(count).padStart(3, '0')}</span>
    </div>
  )
}
