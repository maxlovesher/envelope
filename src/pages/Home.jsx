import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BigType from '../components/BigType.jsx'
import Leaf from '../components/Leaf.jsx'
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

// Each stat tile gets one of the palette colours
const numbers = [
  { value: projects.length, label: 'Projects', color: 'var(--c1)' },
  { value: live, label: 'Live sites', color: 'var(--c3)' },
  { value: stack.length, label: 'Technologies', color: 'var(--c4)' },
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
      <section className="hero2">
        <div className="hero-stage">
          <Leaf className="leaf-h1" tone="deep" style={{ '--r': '-28deg' }} />
          <Leaf className="leaf-h2" shape="round" tone="fresh" style={{ '--r': '22deg' }} />
          <Leaf className="leaf-h3" tone="pale" style={{ '--r': '64deg' }} />
          <BigType as="h1" lines={['Max']} className="hero-name" />
        </div>
        <div className="hero-meta">
          <Roles />
          <p className="hero-hi">
            <em className="serif">Hey, I&apos;m</em> Max. I build things, from red-teaming harnesses to a vinyl
            player that runs in your browser.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="button solid" data-cursor="Work">
              See my work
            </Link>
            <a className="button" href="https://github.com/maxlovesher" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
      <Marquee />
      <section className="bento" aria-label="About">
        <div className="tile tile-statement">
          <Reveal
            as="p"
            text="I build across AI evaluation, computer vision, music and the web, and I like the work to show its numbers."
          />
        </div>
        {numbers.map((n) => (
          <div key={n.label} className="tile tile-stat" style={{ '--tile': n.color }}>
            <b>{n.value}</b>
            <span>{n.label}</span>
          </div>
        ))}
        <div className="tile tile-how">
          <h2 className="label">How I work</h2>
          <ol>
            {principles.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="tile tile-stack">
          <h2 className="label">Built with</h2>
          <ul className="tags flat">
            {stack.map(([name, n]) => (
              <li key={name}>
                {name}
                {n > 1 && <b> ×{n}</b>}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="work">
        <img className="spidey" src="/media/spidey.png" alt="" aria-hidden="true" />
        <Leaf className="leaf-w1" shape="round" tone="fresh" style={{ '--r': '-18deg' }} />
        <Leaf className="leaf-w2" tone="pale" style={{ '--r': '40deg' }} />
        <BigType lines={['Stuff', 'I built']} stretch={1.9} />
        <ProjectList />
      </section>
      <section className="cta">
        <Leaf className="leaf-c1" shape="round" tone="deep" style={{ '--r': '210deg' }} />
        <Leaf className="leaf-c2" tone="fresh" style={{ '--r': '35deg' }} />
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
