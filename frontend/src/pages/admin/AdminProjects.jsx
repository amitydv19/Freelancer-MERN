import { useEffect, useState } from 'react'
import api from '../../services/api'

const statusMeta = {
  Completed: { color: '#43d9ad', bg: 'rgba(67,217,173,0.12)' },
  'In Progress': { color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
  Open: { color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  Cancelled: { color: '#ff6584', bg: 'rgba(255,101,132,0.12)' },
}

const getStatus = (s) =>
  statusMeta[s] || { color: '#8585a0', bg: 'rgba(133,133,160,0.12)' }

const AdminProjects = () => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [filters, setFilters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/project')
        setProjects(data)
        const uniqueSkills = [...new Set(data.flatMap((p) => p.skills))]
        setSkills(uniqueSkills)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const toggleSkill = (skill) =>
    setFilters((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )

  const displayProjects = projects
    .filter((p) => filters.length === 0 || filters.every((s) => p.skills.includes(s)))
    .filter((p) => statusFilter === 'All' || p.status === statusFilter)
    .filter(
      (p) =>
        search === '' ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    )

  const statuses = ['All', ...Object.keys(statusMeta)]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-wrap {
          min-height: 100vh;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          color: #f0f0f8;
          display: flex;
          flex-direction: column;
        }

        /* Topbar */
        .ap-topbar {
          padding: 28px 28px 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .ap-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
        }
        .ap-sub { font-size: 13px; color: #8585a0; margin-top: 4px; }

        .ap-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 12px;
          padding: 9px 14px;
        }
        .ap-search svg { color: #8585a0; flex-shrink: 0; }
        .ap-search input {
          background: none;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #f0f0f8;
          width: 220px;
        }
        .ap-search input::placeholder { color: #8585a0; }

        /* Status tabs */
        .ap-tabs {
          display: flex;
          gap: 6px;
          padding: 0 28px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .ap-tab {
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #2e2e3a;
          background: #17171d;
          color: #8585a0;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .ap-tab:hover { border-color: #3e3e55; color: #c8c8e0; }
        .ap-tab.active {
          background: rgba(108,99,255,0.15);
          border-color: #6c63ff;
          color: #6c63ff;
        }

        /* Body */
        .ap-body {
          display: flex;
          gap: 20px;
          padding: 0 28px 28px;
          flex: 1;
          align-items: flex-start;
        }

        /* Sidebar */
        .ap-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 16px;
          padding: 18px;
          position: sticky;
          top: 20px;
        }
        .ap-sidebar-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #8585a0;
          margin-bottom: 14px;
        }
        .ap-skill-list { display: flex; flex-direction: column; gap: 4px; }
        .ap-skill-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ap-skill-item:hover { background: #1e1e26; }
        .ap-skill-item.active { background: rgba(108,99,255,0.12); }
        .ap-checkbox {
          width: 16px; height: 16px;
          border-radius: 5px;
          border: 1.5px solid #3e3e55;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .ap-checkbox.checked { background: #6c63ff; border-color: #6c63ff; }
        .ap-checkbox-tick { color: #fff; font-size: 10px; line-height: 1; }
        .ap-skill-label { font-size: 13px; color: #c8c8e0; }
        .ap-skill-item.active .ap-skill-label { color: #6c63ff; }
        .ap-clear {
          width: 100%;
          margin-top: 14px;
          padding: 8px;
          background: none;
          border: 1px solid #2e2e3a;
          border-radius: 10px;
          color: #8585a0;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .ap-clear:hover { border-color: #ff6584; color: #ff6584; }

        /* Main */
        .ap-main { flex: 1; display: flex; flex-direction: column; gap: 14px; min-width: 0; }

        .ap-count {
          font-size: 13px;
          color: #8585a0;
          margin-bottom: 2px;
        }

        /* Project card */
        .proj-card {
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 16px;
          padding: 20px 22px;
          transition: transform 0.16s, border-color 0.16s, box-shadow 0.16s;
          cursor: default;
        }
        .proj-card:hover {
          transform: translateY(-2px);
          border-color: #3e3e55;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        }
        .proj-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .proj-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #f0f0f8;
          line-height: 1.3;
        }
        .proj-status {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 11px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .proj-desc {
          font-size: 13px;
          color: #8585a0;
          line-height: 1.6;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .proj-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .proj-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .proj-skill-tag {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(108,99,255,0.1);
          color: #9d97ff;
          border: 1px solid rgba(108,99,255,0.2);
        }
        .proj-budget {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #43d9ad;
        }
        .proj-budget-icon {
          width: 22px; height: 22px;
          border-radius: 6px;
          background: rgba(67,217,173,0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
        }

        /* Empty state */
        .ap-empty {
          text-align: center;
          padding: 60px 20px;
          color: #8585a0;
        }
        .ap-empty-icon {
          font-size: 36px;
          margin-bottom: 12px;
          opacity: 0.5;
        }
        .ap-empty-title { font-size: 16px; color: #c8c8e0; margin-bottom: 6px; }
        .ap-empty-sub { font-size: 13px; }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #17171d 25%, #1e1e26 50%, #17171d 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skel-card {
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 16px;
          padding: 20px 22px;
        }

        @media (max-width: 768px) {
          .ap-body { flex-direction: column; padding: 0 16px 24px; }
          .ap-sidebar { width: 100%; position: static; }
          .ap-topbar { padding: 20px 16px 0; }
          .ap-tabs { padding: 0 16px; }
          .ap-search input { width: 160px; }
        }
      `}</style>

      <div className="ap-wrap">
        <div className="ap-topbar">
          <div>
            <div className="ap-title">All Projects</div>
            <div className="ap-sub">Browse and filter all platform projects</div>
          </div>
          <div className="ap-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="ap-tabs">
          {statuses.map((s) => (
            <button
              key={s}
              className={`ap-tab${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ap-body">
          {/* Sidebar */}
          <aside className="ap-sidebar">
            <div className="ap-sidebar-title">Filter by Skill</div>
            <div className="ap-skill-list">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className={`ap-skill-item${filters.includes(skill) ? ' active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  <div className={`ap-checkbox${filters.includes(skill) ? ' checked' : ''}`}>
                    {filters.includes(skill) && <span className="ap-checkbox-tick">✓</span>}
                  </div>
                  <span className="ap-skill-label">{skill}</span>
                </div>
              ))}
            </div>
            {filters.length > 0 && (
              <button className="ap-clear" onClick={() => setFilters([])}>
                Clear filters ({filters.length})
              </button>
            )}
          </aside>

          {/* Main */}
          <main className="ap-main">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="skel-card">
                  <div className="skeleton" style={{ height: 20, width: '55%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 13, width: '90%', marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 13, width: '70%', marginBottom: 16 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="skeleton" style={{ height: 24, width: 72, borderRadius: 20 }} />
                    <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 20 }} />
                  </div>
                </div>
              ))
            ) : displayProjects.length === 0 ? (
              <div className="ap-empty">
                <div className="ap-empty-icon">📂</div>
                <div className="ap-empty-title">No projects found</div>
                <div className="ap-empty-sub">Try adjusting your filters or search query</div>
              </div>
            ) : (
              <>
                <div className="ap-count">{displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''} found</div>
                {displayProjects.map((project) => {
                  const st = getStatus(project.status)
                  return (
                    <div key={project._id} className="proj-card">
                      <div className="proj-card-top">
                        <div className="proj-title">{project.title}</div>
                        <span
                          className="proj-status"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="proj-desc">{project.description}</p>
                      <div className="proj-meta">
                        <div className="proj-skills">
                          {(project.skills || []).slice(0, 5).map((skill) => (
                            <span key={skill} className="proj-skill-tag">{skill}</span>
                          ))}
                          {project.skills?.length > 5 && (
                            <span className="proj-skill-tag">+{project.skills.length - 5}</span>
                          )}
                        </div>
                        <div className="proj-budget">
                          <div className="proj-budget-icon">₹</div>
                          {Number(project.budget).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminProjects