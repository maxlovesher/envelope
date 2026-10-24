import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/${project.slug}`} className="card">
      <h3>{project.name}</h3>
      <p>{project.tagline}</p>
      {project.tags.length > 0 && (
        <ul className="tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </Link>
  )
}
