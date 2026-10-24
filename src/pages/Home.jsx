import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { projects } from '../data/projects.js'

const live = projects.filter((p) => p.url).length

// Most-used technologies first, so the list reflects what the projects actually share.
const stack = (() => {
  const counts = new Map()
  for (const p of projects) for (const t of p.stack ?? []) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})()

const numbers = [
  { value: projects.length, label: 'Projects' },
  { value: live, label: 'Live sites' },
  { value: stack.length, label: 'Technologies' },
]

// Habits that show up across the case studies.
const principles = [
  {
    title: 'Measured, not claimed',
    text: 'Canary and RAGBench write their own metrics, report intervals, and say where a number is only a proxy.',
  },
  {
    title: 'Stays on your machine',
    text: 'fiilter grades on your GPU and Muszi keeps your crate in the browser. Nothing is uploaded.',
  },
  {
    title: 'Honest about the gaps',
    text: 'VeloCiTI leaves fields blank rather than guessing, and labels its simulated registration records as simulated.',
  },
]

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
      <dl className="stats home-stats">
        {numbers.map((n) => (
          <div key={n.label}>
            <dt>{n.value}</dt>
            <dd>{n.label}</dd>
          </div>
        ))}
      </dl>
      <section>
        <h2 className="label">Featured projects</h2>
        <div className="list">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
      <section className="home-block">
        <h2 className="label">How I work</h2>
        <ul className="highlights">
          {principles.map((p, i) => (
            <li key={p.title}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="home-block">
        <h2 className="label">Built with</h2>
        <ul className="tags flat">
          {stack.map(([name, n]) => (
            <li key={name}>
              {name}
              {n > 1 && <b> ×{n}</b>}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
