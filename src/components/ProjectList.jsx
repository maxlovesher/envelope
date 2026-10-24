import { useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard.jsx'
import { projects } from '../data/projects.js'

// Numbered project rows with a preview card that follows the cursor (fine pointers only).
export default function ProjectList({ items = projects }) {
  const previewRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const el = previewRef.current
    let frame = 0
    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 110}px, 0)`
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const onOver = (e) => {
    const slug = e.target.closest('[data-slug]')?.dataset.slug
    setHovered(projects.find((p) => p.slug === slug) ?? null)
  }

  const stat = hovered?.stats?.[0]

  return (
    <>
      <div className="list" onPointerOver={onOver} onPointerLeave={() => setHovered(null)}>
        {items.map((p) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} />
        ))}
      </div>
      <div ref={previewRef} className={`preview${hovered ? ' show' : ''}`} aria-hidden="true">
        {hovered && (
          <div className="preview-card" style={{ background: hovered.tint }}>
            {hovered.cover ? (
              <img src={hovered.cover} alt="" />
            ) : (
              <>
                <span className="preview-kind">{hovered.kind}</span>
                {stat ? (
                  <span className="preview-stat">
                    <b>{stat.value}</b>
                    {stat.label}
                  </span>
                ) : (
                  <span className="preview-stat">
                    <b>{hovered.name}</b>
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
