import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BigType from '../components/BigType.jsx'
import Distort from '../components/Distort.jsx'
import Marquee from '../components/Marquee.jsx'
import ProjectList from '../components/ProjectList.jsx'
import Reveal from '../components/Reveal.jsx'
import { projects } from '../data/projects.js'
import { usePrefs } from '../lib/prefs-context.js'
import { useTitle } from '../lib/title.js'

const roles = ['AI evaluation', 'Computer vision', 'Music', 'The web']

// The areas I build in, lit one at a time.
function Roles() {
  const { motion } = usePrefs()
  const [on, setOn] = useState(0)

  useEffect(() => {
    if (!motion) return
    const id = setInterval(() => setOn((i) => (i + 1) % roles.length), 1600)
    return () => clearInterval(id)
  }, [motion])

  return (
    <ul className="roles" aria-label="What I build">
      {roles.map((r, i) => (
        <li key={r} className={!motion || i === on ? 'on' : ''}>
          {r}
        </li>
      ))}
    </ul>
  )
}

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
  useTitle(null)
  return (
    <>
      <section className="hero hero-x">
        <div className="hero-top">
          <div className="hero-intro">
            <Roles />
            <div className="hero-copy">
              <p>
                <em className="serif">Hey, I&apos;m</em> Max. I build things.
              </p>
              <Link to="/projects" className="button" data-cursor="Work">
                See my work
              </Link>
            </div>
          </div>
          <Distort src="/media/cat.webp" alt="A tabby cat asleep, printed in blue and cream" className="hero-cat" />
        </div>
        <BigType as="h1" lines={['Max']} className="hero-name" />
      </section>
      <Marquee />
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
      <section className="work">
        <img className="spidey" src="/media/spidey.png" alt="" aria-hidden="true" />
        <BigType lines={['Stuff', 'I built']} stretch={1.9} />
        <ProjectList />
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
      <section className="cta">
        <div className="cta-copy">
          <BigType lines={['Next', 'chapter']} filled={[1]} />
          <p className="lead">More is on the way. Follow along on GitHub, or dig through everything built so far.</p>
          <p className="actions">
            <a className="button solid" href="https://github.com/maxlovesher" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <Link to="/projects" className="button">
              All projects
            </Link>
          </p>
        </div>
        <figure className="poster">
          <img src="/media/galaxy.webp" alt="Poster of a spiral galaxy that reads: Thanks for the mystery." />
        </figure>
      </section>
    </>
  )
}
