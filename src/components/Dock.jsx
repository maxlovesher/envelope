import { NavLink } from 'react-router-dom'

export default function Dock({ onMenu, menuRef }) {
  return (
    <nav className="dock" aria-label="Primary">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <button ref={menuRef} type="button" onClick={onMenu} aria-haspopup="dialog">
        Menu
      </button>
    </nav>
  )
}
