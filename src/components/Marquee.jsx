import { Link } from 'react-router-dom'
import { projects } from '../data/projects.js'

// An endless strip of project names. Two identical halves let the loop wrap without a seam.
export default function Marquee() {
  const half = (copy) =>
    projects.map((p) => (
      <Link
        key={`${copy}-${p.slug}`}
        to={`/${p.slug}`}
        data-cursor="Open"
        tabIndex={copy ? -1 : undefined}
        aria-hidden={copy ? true : undefined}
      >
        {p.name}
        <span className="star" aria-hidden="true">
          ✺
        </span>
      </Link>
    ))

  return (
    <nav className="marquee" aria-label="All projects">
      <div className="marquee-track">
        {half(0)}
        {half(1)}
      </div>
    </nav>
  )
}
