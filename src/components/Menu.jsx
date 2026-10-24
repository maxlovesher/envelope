import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { usePrefs } from '../lib/prefs-context.js'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { href: 'https://github.com/maxlovesher', label: 'GitHub' },
]

export default function Menu({ open, onClose }) {
  const { motion, theme, toggleMotion, toggleTheme } = usePrefs()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={`menu${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div className="menu-top">
        <span className="label">Menu</span>
        <button ref={closeRef} type="button" className="pill" onClick={onClose}>
          Close
        </button>
      </div>
      <nav className="menu-links">
        {links.map((l, i) =>
          l.to ? (
            <Link key={l.label} to={l.to} onClick={onClose}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              {l.label} ↗
            </a>
          ),
        )}
      </nav>
      <div className="menu-settings">
        <span className="label">Settings</span>
        <button type="button" className="pill" onClick={toggleMotion} aria-pressed={motion}>
          Motion <b>{motion ? 'On' : 'Off'}</b>
        </button>
        <button type="button" className="pill" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
          Dark mode <b>{theme === 'dark' ? 'On' : 'Off'}</b>
        </button>
      </div>
    </div>
  )
}
