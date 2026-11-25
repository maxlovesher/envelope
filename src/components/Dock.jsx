import { NavLink } from 'react-router-dom'

export default function Dock({ onMenu, menuRef, onColors, colorsRef, colorsOpen }) {
  return (
    <nav className="dock" aria-label="Primary">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <button
        ref={colorsRef}
        type="button"
        onClick={onColors}
        aria-haspopup="dialog"
        aria-expanded={colorsOpen}
        className={colorsOpen ? 'active' : ''}
      >
        Colours
      </button>
      <button ref={menuRef} type="button" onClick={onMenu} aria-haspopup="dialog">
        Menu
      </button>
    </nav>
  )
}
