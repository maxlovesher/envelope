import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects.js'
import NotFound from './NotFound.jsx'

// Rendered at /<slug> (project passed as a prop) and /projects/:slug (looked up from the URL).
export default function Project({ project: given }) {
  const { slug } = useParams()
  const project = given ?? projects.find((p) => p.slug === slug)

  useEffect(() => {
    if (project?.url) window.location.replace(project.url)
  }, [project])

  if (!project) return <NotFound />
  if (project.url) return null

  return (
    <article>
      <Link to="/projects" className="back">
        ← All projects
      </Link>
      <h1 className="page-title">{project.name}</h1>
      <p className="lead">{project.tagline}</p>
      <p>{project.description}</p>
      {project.tags.length > 0 && (
        <ul className="tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {project.links.length > 0 && (
        <p className="links">
          {project.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </p>
      )}
    </article>
  )
}
