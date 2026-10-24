import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { projects } from '../data/projects.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>
          <em className="serif">Hey, I&apos;m</em> Max.
        </h1>
        <p>I build things.</p>
        <Link to="/projects" className="button">
          See my work
        </Link>
      </section>
      <section className="statement">
        <Reveal
          as="p"
          text="I build across AI evaluation, computer vision, music and the web, from red-teaming harnesses to a vinyl player that runs in your browser."
        />
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
