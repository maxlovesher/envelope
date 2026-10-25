import { useEffect, useMemo, useState } from 'react'
import { PrefsContext } from './prefs-context.js'

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
  // Dark unless the visitor has switched to light
  const [theme, setTheme] = useState(() => (read('prefs:theme') === 'light' ? 'light' : 'dark'))

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off'
  }, [motion])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = useMemo(
    () => ({
      motion,
      theme,
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
    [motion, theme],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}
