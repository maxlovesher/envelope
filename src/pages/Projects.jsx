import { useSearchParams } from 'react-router-dom'
import ProjectList from '../components/ProjectList.jsx'
import { areas, projects } from '../data/projects.js'
import { useTitle } from '../lib/title.js'

export default function Projects() {
  useTitle('Projects')
  const [params, setParams] = useSearchParams()
  const area = areas.includes(params.get('area')) ? params.get('area') : null
  const items = area ? projects.filter((p) => p.area === area) : projects

  const filters = [
    { value: null, label: 'All', count: projects.length },
    ...areas.map((a) => ({ value: a, label: a, count: projects.filter((p) => p.area === a).length })),
  ]

  return (
    <section>
      <h1 className="page-title">Projects</h1>
      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            className={`pill${area === f.value ? ' on' : ''}`}
            aria-pressed={area === f.value}
            onClick={() => setParams(f.value ? { area: f.value } : {}, { replace: true })}
          >
            {f.label}
            <b>{f.count}</b>
          </button>
        ))}
      </div>
      <ProjectList items={items} />
    </section>
  )
}
