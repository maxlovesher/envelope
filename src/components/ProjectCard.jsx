import { Link } from 'react-router-dom'
import { setTint } from '../lib/tint.js'

export default function ProjectCard({ project, index }) {
  const tint = {
    onMouseEnter: () => setTint(project.tint),
    onMouseLeave: () => setTint(null),
    onFocus: () => setTint(project.tint),
    onBlur: () => setTint(null),
  }

  const body = (
    <>
      <span className="num">{String(index + 1).padStart(2, '0')}</span>
      <div className="body">
        <h3>{project.name}</h3>
        <p>{project.tagline}</p>
      </div>
      <ul className="tags">
        {project.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </>
  )

  return (
    <Link to={`/${project.slug}`} className="card" {...tint}>
      {body}
    </Link>
  )
}
