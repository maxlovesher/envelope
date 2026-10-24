import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>
          Hey, I&apos;m <span className="accent">Max</span>.
        </h1>
        <p>I build things. Placeholder intro — say who you are and what you make.</p>
        <Link to="/projects" className="button">
          See my work
        </Link>
      </section>
      <section>
        <h2>Featured projects</h2>
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </>
  )
}
