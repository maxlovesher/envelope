import { useEffect, useRef, useState } from 'react'
import { usePrefs } from '../lib/prefs-context.js'

// A case-study visual, picked by `figure.type`. Everything is drawn from the data in projects.js.
export default function Figure({ figure }) {
  const Body = kinds[figure.type]
  if (!Body) return null
  return (
    <figure className={`figure figure-${figure.type}`}>
      <Body {...figure} />
      {figure.caption && <figcaption>{figure.caption}</figcaption>}
    </figure>
  )
}

const pct = (v) => `${v.toFixed(1)}%`

// Scatter with confidence whiskers, e.g. attack success against false refusals.
function Tradeoff({ points, x: xTitle, y: yTitle }) {
  const [active, setActive] = useState(null)
  const W = 640
  const H = 380
  const m = { l: 56, r: 24, t: 20, b: 52 }
  const xMax = 80
  const yMax = 15
  const sx = (v) => m.l + (v / xMax) * (W - m.l - m.r)
  const sy = (v) => H - m.b - (v / yMax) * (H - m.t - m.b)
  const hovered = points[active]

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${yTitle} against ${xTitle}`}>
        {[0, 20, 40, 60, 80].map((t) => (
          <g key={`x${t}`} className="grid">
            <line x1={sx(t)} x2={sx(t)} y1={m.t} y2={H - m.b} />
            <text x={sx(t)} y={H - m.b + 18} textAnchor="middle">
              {t}%
            </text>
          </g>
        ))}
        {[0, 5, 10, 15].map((t) => (
          <g key={`y${t}`} className="grid">
            <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} />
            <text x={m.l - 10} y={sy(t) + 4} textAnchor="end">
              {t}%
            </text>
          </g>
        ))}
        <text className="axis-title" x={(m.l + W - m.r) / 2} y={H - 8} textAnchor="middle">
          {xTitle} →
        </text>
        <text className="axis-title" transform={`translate(14 ${(m.t + H - m.b) / 2}) rotate(-90)`} textAnchor="middle">
          {yTitle} →
        </text>
        {points.map((p, i) => {
          const cx = sx(p.x[0])
          const cy = sy(p.y[0])
          const left = p.x[0] > 55
          return (
            <g
              key={p.name}
              className={`point${active === i ? ' on' : ''}${active !== null && active !== i ? ' dim' : ''}`}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <line className="whisker" x1={sx(p.x[1])} x2={sx(p.x[2])} y1={cy} y2={cy} />
              <line className="whisker" x1={cx} x2={cx} y1={sy(p.y[1])} y2={sy(p.y[2])} />
              <circle className="dot" cx={cx} cy={cy} r={6} />
              <circle className="hit" cx={cx} cy={cy} r={20} />
              <text x={left ? cx - 12 : cx + 12} y={cy - 12} textAnchor={left ? 'end' : 'start'}>
                {p.name}
              </text>
            </g>
          )
        })}
      </svg>
      {hovered && (
        <div
          className="tooltip"
          style={{ left: `${(sx(hovered.x[0]) / W) * 100}%`, top: `${(sy(hovered.y[0]) / H) * 100}%` }}
        >
          <b>{hovered.name}</b>
          <span>
            Attack success {pct(hovered.y[0])} <i>({pct(hovered.y[1])}–{pct(hovered.y[2])})</i>
          </span>
          <span>
            False refusals {pct(hovered.x[0])} <i>({pct(hovered.x[1])}–{pct(hovered.x[2])})</i>
          </span>
        </div>
      )}
      <table className="sr-only">
        <thead>
          <tr>
            <th>Condition</th>
            <th>{yTitle}</th>
            <th>{xTitle}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{pct(p.y[0])}</td>
              <td>{pct(p.x[0])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Paired horizontal bars on a 0–1 scale, one row per metric.
function Compare({ series, rows }) {
  return (
    <div className="compare">
      <ul className="legend">
        {series.map((s, i) => (
          <li key={s}>
            <span className={`swatch s${i}`} />
            {s}
          </li>
        ))}
      </ul>
      <dl>
        {rows.map((r) => (
          <div key={r.name} className="compare-row">
            <dt>{r.name}</dt>
            <dd>
              {r.values.map((v, i) => (
                <span key={series[i]} className="bar-line" title={`${series[i]}: ${v.toFixed(3)}`}>
                  <span className="bar-track">
                    <span className={`bar s${i}`} style={{ width: `${v * 100}%` }} />
                  </span>
                  <span className="value">{v.toFixed(3)}</span>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// Thresholds that climb, like a rank ladder.
function Ladder({ steps, unit }) {
  const max = Math.max(...steps.map((s) => s.value))
  return (
    <ol className="ladder">
      {steps.map((s, i) => (
        <li key={s.name}>
          <span className="num">{String(i + 1).padStart(2, '0')}</span>
          <span className="ladder-name">{s.name}</span>
          <span className="ladder-track">
            <span className="bar" style={{ width: `max(8px, ${(s.value / max) * 100}%)` }} />
          </span>
          <span className="value">
            {s.value.toLocaleString('en-US')} {unit}
          </span>
        </li>
      ))}
    </ol>
  )
}

// Plays a short sequence of frames while it is on screen.
function Flipbook({ frames, caption }) {
  const { motion } = usePrefs()
  const ref = useRef(null)
  const [frame, setFrame] = useState(0)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const playing = motion && visible && !paused

  useEffect(() => {
    frames.forEach((src) => {
      new Image().src = src
    })
  }, [frames])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), 140)
    return () => clearInterval(id)
  }, [playing, frames.length])

  return (
    <div ref={ref} className="flipbook">
      <img src={frames[motion ? frame : Math.floor(frames.length / 2)]} alt={caption} />
      {motion && (
        <button type="button" className="pill flip-toggle" onClick={() => setPaused((p) => !p)}>
          {paused ? 'Play' : 'Pause'}
        </button>
      )}
    </div>
  )
}

const kinds = { tradeoff: Tradeoff, compare: Compare, ladder: Ladder, flipbook: Flipbook }
