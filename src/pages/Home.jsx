import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>
          <span className="ghost">Hey, I&apos;m</span> Max.
        </h1>
        <p>I build things. Placeholder intro — say who you are and what you make.</p>
        <Link to="/projects" className="button">
          See my work
        </Link>
      </section>
      <section>
        <h2 className="label">Featured projects</h2>
        <div className="list">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}
