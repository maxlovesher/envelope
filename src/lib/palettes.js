// The 25 bright colours from the reference sheet, row by row
export const BRIGHTS = [
  '#00A5E3', '#8DD7BF', '#FF96C5', '#FF5768', '#FFBF65',
  '#FC6238', '#FFD872', '#F2D4CC', '#E77577', '#6C88C4',
  '#C05780', '#FF828B', '#E7C582', '#00B0BA', '#0065A2',
  '#00CDAC', '#FF6F68', '#FFDACC', '#FF60A8', '#CFF800',
  '#FF5C77', '#4DD091', '#FFEC59', '#FFA23A', '#74737A',
]

// Each palette has:
//   ink     text and big type on white, dark enough to read
//   main    its boldest colour: big type and buttons in dark mode
//   colors  five swatches for the stat tiles, leaves and particles (first three are the tiles)
// Between them the palettes use every one of BRIGHTS.
export const PALETTES = [
  {
    id: 'fresh',
    name: 'Fresh',
    ink: '#0b6e3d',
    main: '#16c172',
    colors: ['#16c172', '#c6f6da', '#86e3b0', '#34d399', '#0e9f6e'],
    // The original swarm colours, kept exactly
    swarm: {
      light: ['#0b6e3d', '#0e9f6e', '#16c172', '#34d399'],
      dark: ['#16c172', '#34d399', '#6ee7b7', '#a7f3d0'],
    },
  },
  { id: 'lagoon', name: 'Lagoon', ink: '#0065A2', main: '#00A5E3', colors: ['#00A5E3', '#8DD7BF', '#00CDAC', '#00B0BA', '#0065A2'] },
  { id: 'candy', name: 'Candy', ink: '#A3416A', main: '#FF60A8', colors: ['#FF60A8', '#F2D4CC', '#FF96C5', '#FF828B', '#FFDACC'] },
  { id: 'sunset', name: 'Sunset', ink: '#B3401F', main: '#FC6238', colors: ['#FC6238', '#FFD872', '#FFBF65', '#FFA23A', '#FF5768'] },
  { id: 'reef', name: 'Coral reef', ink: '#00797F', main: '#FF6F68', colors: ['#FF6F68', '#FFDACC', '#00CDAC', '#FF5C77', '#00B0BA'] },
  { id: 'retro', name: 'Retro', ink: '#4B5F9E', main: '#6C88C4', colors: ['#6C88C4', '#E7C582', '#E77577', '#C05780', '#74737A'] },
  { id: 'electric', name: 'Electric', ink: '#1F2A44', main: '#FF60A8', colors: ['#CFF800', '#FFEC59', '#00A5E3', '#FF60A8', '#4DD091'] },
  { id: 'summer', name: 'Summer', ink: '#1D6B4A', main: '#4DD091', colors: ['#4DD091', '#FFEC59', '#FFA23A', '#FF5C77', '#00A5E3'] },
  { id: 'bloom', name: 'Bloom', ink: '#C23345', main: '#FF5768', colors: ['#FF5768', '#FFD872', '#FF96C5', '#8DD7BF', '#FFBF65'] },
  { id: 'slate', name: 'Slate', ink: '#4A4950', main: '#74737A', colors: ['#74737A', '#F2D4CC', '#8DD7BF', '#6C88C4', '#E77577'] },
]

export const DEFAULT_PALETTE = 'fresh'

export const paletteById = (id) => PALETTES.find((p) => p.id === id) ?? PALETTES[0]

const same = (a, b) => a.toLowerCase() === b.toLowerCase()

/** Palettes that use a colour anywhere: as ink, main or a swatch. */
export const palettesWith = (hex) =>
  PALETTES.filter((p) => [p.ink, p.main, ...p.colors].some((c) => same(c, hex)))

/** Relative luminance (WCAG), 0 for black to 1 for white. */
export function luminance(hex) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Colours for the particles: skip ones too pale to see on white, or too dark to see on the dark theme. */
export function swarmColors(palette, dark) {
  if (palette.swarm) return palette.swarm[dark ? 'dark' : 'light']
  const pool = [...new Set([palette.ink, palette.main, ...palette.colors].map((c) => c.toLowerCase()))]
  const visible = pool.filter((c) => (dark ? luminance(c) > 0.12 : luminance(c) < 0.55))
  return visible.slice(0, 5)
}

/** Writes a palette into the CSS variables the stylesheet builds its colours from. */
export function applyPalette(palette) {
  const root = document.documentElement.style
  root.setProperty('--p-ink', palette.ink)
  root.setProperty('--p-main', palette.main)
  palette.colors.forEach((c, i) => root.setProperty(`--p${i}`, c))
}
