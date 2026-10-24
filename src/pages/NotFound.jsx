import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section>
      <h1 className="page-title">404</h1>
      <p className="lead">That page doesn&apos;t exist.</p>
      <Link to="/" className="button">
        Back home
      </Link>
    </section>
  )
}
