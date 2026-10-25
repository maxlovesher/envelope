import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Cursor from './Cursor.jsx'
import Dock from './Dock.jsx'
import Hud from './Hud.jsx'
import Intro from './Intro.jsx'
import Menu from './Menu.jsx'
import SmoothScroll from './SmoothScroll.jsx'
import { scrollToTop, setScrollLocked } from '../lib/scroll.js'
import { usePrefs } from '../lib/prefs-context.js'
import { setTint } from '../lib/tint.js'

const year = new Date().getFullYear()

// Pill switch in the header: the knob sits left with a moon in dark mode, right with a sun in light.
function ThemeSwitch() {
  const { theme, toggleTheme } = usePrefs()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className={`theme-switch${dark ? '' : ' light'}`}
      onClick={toggleTheme}
      aria-pressed={dark}
      aria-label="Dark mode"
      data-cursor={dark ? 'Light' : 'Dark'}
    >
      <span className="knob" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14">
          {dark ? (
            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" />
          ) : (
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
              <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </g>
          )}
        </svg>
      </span>
    </button>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    scrollToTop()
    setTint(null)
  }, [pathname])

  useEffect(() => {
    setScrollLocked(menuOpen)
    return () => setScrollLocked(false)
  }, [menuOpen])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuRef.current?.focus()
  }, [])

  return (
    <>
      <SmoothScroll />
      <Intro />
      <header className={`header${pathname === '/' ? ' header-home' : ''}`}>
        <Link to="/" className="brand" aria-label="maxlovesher home">
          <img src="/media/brand.webp" alt="" />
        </Link>
        <ThemeSwitch />
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>© {year} maxlovesher</span>
        <span className="footer-links">
          <Link to="/projects">Projects</Link>
          <a href="https://github.com/maxlovesher" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <button type="button" onClick={() => scrollToTop({ smooth: true })}>
            Back to top ↑
          </button>
        </span>
      </footer>
      <Hud />
      <Dock onMenu={() => setMenuOpen(true)} menuRef={menuRef} />
      <Menu open={menuOpen} onClose={closeMenu} />
      <Cursor />
    </>
  )
}
