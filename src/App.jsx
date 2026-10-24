import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Project from './pages/Project.jsx'
import Projects from './pages/Projects.jsx'
import NotFound from './pages/NotFound.jsx'
import { projects } from './data/projects.js'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        {/* Top-level shortcuts: /ragbench, /velociti, /ivy */}
        {projects.map((p) => (
          <Route key={p.slug} path={p.slug} element={<Project project={p} />} />
        ))}
        <Route path="projects/:slug" element={<Project />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
