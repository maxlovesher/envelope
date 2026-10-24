import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const year = new Date().getFullYear()

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <header className="header">
        <Link to="/" className="brand" aria-label="maxlovesher home">
          M
        </Link>
        <nav className="nav">
          <NavLink to="/projects">Projects</NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">© {year} maxlovesher</footer>
    </>
  )
}
