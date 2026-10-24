import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  return (
    <section>
      <h1 className="page-title">Projects</h1>
      <div className="list" style={{ marginTop: 'clamp(40px, 8vh, 96px)' }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
