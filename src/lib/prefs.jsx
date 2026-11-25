import { useEffect, useMemo, useState } from 'react'
import { PrefsContext } from './prefs-context.js'
import { DEFAULT_PALETTE, PALETTES, applyPalette, paletteById } from './palettes.js'

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // storage blocked: the choice just won't persist
  }
}

export function PrefsProvider({ children }) {
  const [motion, setMotion] = useState(() => {
    const saved = read('prefs:motion')
    if (saved) return saved === 'on'
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  // Light (white) unless the visitor has switched to dark
  const [theme, setTheme] = useState(() => (read('prefs:theme') === 'dark' ? 'dark' : 'light'))

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off'
  }, [motion])

  // Colour palette picked in the Colours panel; unknown ids fall back to the default
  const [palette, setPaletteState] = useState(() => {
    const saved = read('prefs:palette')
    return PALETTES.some((p) => p.id === saved) ? saved : DEFAULT_PALETTE
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    applyPalette(paletteById(palette))
  }, [palette])

  const value = useMemo(
    () => ({
      motion,
      theme,
      palette,
      setPalette: (id) => {
        write('prefs:palette', id)
        setPaletteState(id)
      },
      toggleMotion: () => {
        write('prefs:motion', motion ? 'off' : 'on')
        setMotion(!motion)
      },
      toggleTheme: () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        write('prefs:theme', next)
        setTheme(next)
      },
    }),
    [motion, theme, palette],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}
