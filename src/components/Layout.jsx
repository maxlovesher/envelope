import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Dock from './Dock.jsx'
import Hud from './Hud.jsx'
import Intro from './Intro.jsx'
import Menu from './Menu.jsx'
import SmoothScroll from './SmoothScroll.jsx'
import { scrollToTop, setScrollLocked } from '../lib/scroll.js'
import { setTint } from '../lib/tint.js'

const year = new Date().getFullYear()

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
      <header className="header">
        <Link to="/" className="brand" aria-label="maxlovesher home">
          M
        </Link>
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
    </>
  )
}
