import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Figure from '../components/Figure.jsx'
import Reveal from '../components/Reveal.jsx'
import { projects } from '../data/projects.js'
import { setTint } from '../lib/tint.js'
import { useTitle } from '../lib/title.js'
import NotFound from './NotFound.jsx'

const at = (i) => projects[(i + projects.length) % projects.length]

// Rendered at /<slug> (project passed as a prop) and /projects/:slug (looked up from the URL).
export default function Project({ project: given }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const index = projects.findIndex((p) => p.slug === (given?.slug ?? slug))
  const project = projects[index]

  useTitle(project?.name ?? 'Not found')

  // ← and → step through the projects, unless a field, a modifier key or the menu is in play.
  useEffect(() => {
    if (index < 0) return
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
      if (document.querySelector('.menu.open')) return
      if (e.key === 'ArrowRight') navigate(`/${at(index + 1).slug}`)
      if (e.key === 'ArrowLeft') navigate(`/${at(index - 1).slug}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, navigate])

  if (!project) return <NotFound />

  const next = at(index + 1)
  const { stats = [], highlights = [], how = [], stack = [], notes, status } = project

  return (
    <article className="case">
      <Link to="/projects" className="back">
        ← All projects
      </Link>
      <p className="kicker">
        {String(index + 1).padStart(2, '0')}
        {project.kind && <span> · {project.kind}</span>}
      </p>
      <h1 className="page-title">{project.name}</h1>
      <p className="lead">{project.tagline}</p>

      {(project.url || project.links.length > 0) && (
        <p className="actions">
          {project.url && (
            <a className="button solid" href={project.url} target="_blank" rel="noreferrer">
              Visit live site ↗
            </a>
          )}
          {project.links.map((l) => (
            <a key={l.href} className="button" href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </p>
      )}

      {stats.length > 0 && (
        <dl className="stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="about">
        <Reveal as="p" text={project.description} />
      </section>

      {project.figure && (
        <section>
          <h2 className="label">In numbers</h2>
          <Figure figure={project.figure} />
        </section>
      )}

      {highlights.length > 0 && (
        <section>
          <h2 className="label">What it does</h2>
          <ul className="highlights">
            {highlights.map((h, i) => (
              <li key={h.title}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {how.length > 0 && (
        <section>
          <h2 className="label">How it works</h2>
          <ol className="steps">
            {how.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {stack.length > 0 && (
        <section>
          <h2 className="label">Built with</h2>
          <ul className="tags flat">
            {stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {(notes || status) && (
        <section className="notes">
          <h2 className="label">Good to know</h2>
          {status && (
            <p>
              <b>Status.</b> {status}
            </p>
          )}
          {notes && <p>{notes}</p>}
        </section>
      )}

      <Link
        to={`/${next.slug}`}
        className="next"
        data-cursor="Next"
        onMouseEnter={() => setTint(next.tint)}
        onMouseLeave={() => setTint(null)}
      >
        <span className="label">Next project</span>
        <span className="next-name">{next.name} →</span>
      </Link>
      <p className="hint" aria-hidden="true">
        Tip: use ← → to browse projects
      </p>
    </article>
  )
}
