import { useEffect, useRef, useState } from 'react'

// A giant condensed headline. Each line's letters flip in when it scrolls into view;
// `filled` lines are solid accent, the rest are outlined.
export default function BigType({ lines, filled = [0], as: Tag = 'h2', className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

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
    <Tag ref={ref} className={`bigtype${shown ? ' in' : ''} ${className}`} aria-label={lines.join(' ')}>
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
