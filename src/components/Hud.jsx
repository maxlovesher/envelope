import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { projects } from '../data/projects.js'

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// Small corner readout: visitor's local time, scroll progress and project count.
export default function Hud() {
  const { pathname } = useLocation()
  const [now, setNow] = useState(clock)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNow(clock()), 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname])

  return (
    <div className="hud" aria-hidden="true">
      <span>{now} local</span>
      <span>
        {String(pct).padStart(3, '0')}% · {String(projects.length).padStart(2, '0')} projects
      </span>
    </div>
  )
}
