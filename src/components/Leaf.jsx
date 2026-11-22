import { useId } from 'react'

// Outline for each leaf shape: slim and pointed, or broad and round
const SHAPES = {
  slim: 'M50 4 C 84 38, 90 104, 50 150 C 10 104, 16 38, 50 4 Z',
  round: 'M50 10 C 94 30, 98 104, 50 146 C 2 104, 6 30, 50 10 Z',
}

// Side veins, mirrored either side of the midrib
const VEINS = [
  [42, 66, 30],
  [62, 70, 50],
  [82, 74, 70],
  [102, 72, 90],
]

const TONES = {
  fresh: ['#34d399', '#0e9f6e'],
  deep: ['#16c172', '#0b6e3d'],
  pale: ['#c6f6da', '#86e3b0'],
}

// A decorative leaf drawn in SVG. Sways gently from its stem; purely decorative.
export default function Leaf({ shape = 'slim', tone = 'fresh', className = '', style }) {
  const id = useId()
  const [from, to] = TONES[tone]
  return (
    <svg className={`leaf ${className}`} style={style} viewBox="0 0 100 160" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={SHAPES[shape]} fill={`url(#${id})`} />
      <g stroke="rgb(255 255 255 / 0.55)" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M50 14 L50 154" />
        {VEINS.map(([y, endX, endY]) => (
          <g key={y}>
            <path d={`M50 ${y} Q ${endX - 6} ${y - 10}, ${endX} ${endY}`} />
            <path d={`M50 ${y} Q ${106 - endX} ${y - 10}, ${100 - endX} ${endY}`} />
          </g>
        ))}
      </g>
      <path d="M50 146 L50 160" stroke={to} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
