import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const body = (
    <>
      <h3>{project.name}</h3>
      <p>{project.tagline}</p>
      {project.tags.length > 0 && (
        <ul className="tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </>
  )

  if (project.url) {
    return (
      <a href={project.url} className="card">
        {body}
      </a>
    )
  }

  return (
    <Link to={`/${project.slug}`} className="card">
      {body}
    </Link>
  )
}
