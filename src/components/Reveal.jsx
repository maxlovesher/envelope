import { useEffect, useRef } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

// Words go from ghost grey to full colour as the text scrolls into view.
export default function Reveal({ text, as: Tag = 'p', className = '' }) {
  const ref = useRef(null)
  const { motion } = usePrefs()
  const words = text.split(' ')

  useEffect(() => {
    const el = ref.current
    const spans = [...el.querySelectorAll('.word')]
    if (!motion) {
      spans.forEach((s) => s.classList.add('on'))
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const { top } = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.5)))
      const lit = progress * spans.length
      spans.forEach((s, i) => s.classList.toggle('on', i < lit))
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
  }, [motion, text])

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="word">
          {w}{' '}
        </span>
      ))}
    </Tag>
  )
}
