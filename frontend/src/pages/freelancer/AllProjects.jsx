import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

/* ── Icons ─────────────────────────────────────────────── */
const IconGrid      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconFolder    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const IconFile      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const IconUser      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconClipboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
const IconLogout    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconSearch    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconFilter    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const IconRupee     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="12" y1="8" x2="6" y2="21"/><path d="M6 3h6a6 6 0 0 1 0 5"/></svg>
const IconUsers     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconCalendar  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconArrow     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IconX         = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .ap * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ap-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #f0f4ff 0%, #f8fafc 60%, #f0fdf4 100%);
  }

  /* Navbar */
  .ap-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ap-nav-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    border: none; background: none; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ap-nav-link:hover { background: #f1f5f9; color: #0f172a; }
  .ap-nav-link.active { background: #eff6ff; color: #2563eb; }

  /* Sidebar */
  .ap-sidebar {
    width: 260px; flex-shrink: 0;
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    padding: 24px; align-self: flex-start;
    position: sticky; top: 88px;
    animation: fadeUp 0.4s ease both;
  }

  /* Project card */
  .ap-card {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    padding: 24px; cursor: pointer;
    transition: all 0.25s; animation: fadeUp 0.4s ease both;
  }
  .ap-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(37,99,235,0.11);
    border-color: #bfdbfe;
  }

  /* Skill tags */
  .ap-skill {
    display: inline-flex; align-items: center;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe; border-radius: 100px;
    padding: 3px 10px; font-size: 11.5px; font-weight: 600;
  }
  .ap-skill-filter {
    display: inline-flex; align-items: center; gap: 5px;
    border-radius: 100px; padding: 5px 10px 5px 12px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; border: 1.5px solid #e2e8f0;
    background: #f8fafc; color: #64748b;
  }
  .ap-skill-filter:hover { border-color: #93c5fd; background: #eff6ff; color: #2563eb; }
  .ap-skill-filter.on { background: #eff6ff; color: #2563eb; border-color: #2563eb; }

  /* Search */
  .ap-search {
    display: flex; align-items: center; gap: 10px;
    background: white; border: 1.5px solid #e2e8f0;
    border-radius: 12px; padding: 10px 14px;
    transition: all 0.2s;
  }
  .ap-search:focus-within { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
  .ap-search input {
    border: none; outline: none; background: transparent;
    font-size: 14px; color: #0f172a; width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ap-search input::placeholder { color: #cbd5e1; }
`

const AllProjects = () => {
  const navigate  = useNavigate()
  const username  = localStorage.getItem('username') || 'Freelancer'

  const [projects,  setProjects]  = useState([])
  const [skills,    setSkills]    = useState([])
  const [filters,   setFilters]   = useState([])
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/project')
        setProjects(data)
        setSkills([...new Set(data.flatMap(p => p.skills || []))])
      } catch (err) { console.error(err) }
    }
    fetch()
  }, [])

  const displayProjects = useMemo(() => {
    let list = [...projects].reverse()
    if (filters.length > 0)
      list = list.filter(p => filters.every(s => p.skills?.includes(s)))
    if (search.trim())
      list = list.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    return list
  }, [projects, filters, search])

  const toggleSkill = (skill) =>
    setFilters(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])

  const logout = () => { localStorage.clear(); navigate('/') }

  const navLinks = [
    { key: 'dashboard',    label: 'Dashboard',    icon: <IconGrid />,      path: '/freelancer' },
    { key: 'projects',     label: 'All Projects', icon: <IconFolder />,    path: '/freelancer/all-projects' },
    { key: 'myprojects',   label: 'My Projects',  icon: <IconFile />,      path: '/freelancer/my-projects' },
    { key: 'applications', label: 'Applications', icon: <IconClipboard />, path: '/freelancer/myApplications' },
    { key: 'profile',      label: 'Profile',      icon: <IconUser />,      path: '/freelancer' },
  ]

  return (
    <div className="ap ap-page">
      <style>{S}</style>

      {/* ── NAVBAR ── */}
      <nav className="ap-nav">
        <span onClick={() => navigate('/')}
          style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', cursor: 'pointer', letterSpacing: '-0.5px' }}>
          SB Works
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(({ key, label, icon, path }) => (
            <button key={key} className={`ap-nav-link${key === 'projects' ? ' active' : ''}`}
              onClick={() => navigate(path)}>
              {icon}{label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '6px 14px' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 13 }}>
              {username[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{username}</span>
          </div>
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6,
              background: '#fef2f2', color: '#ef4444', fontWeight: 600, fontSize: 13,
              padding: '8px 16px', borderRadius: 10, border: '1px solid #fecaca',
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
            <IconLogout /> Logout
          </button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px', display: 'flex', gap: 28 }}>

        {/* ── SIDEBAR ── */}
        <aside className="ap-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <IconFilter />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Filters</span>
            {filters.length > 0 && (
              <span onClick={() => setFilters([])}
                style={{ marginLeft: 'auto', fontSize: 11, color: '#ef4444', fontWeight: 600,
                  cursor: 'pointer', background: '#fef2f2', padding: '2px 8px',
                  borderRadius: 6, border: '1px solid #fecaca' }}>
                Clear
              </span>
            )}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 12 }}>Skills</div>

          {skills.length === 0 ? (
            <p style={{ fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' }}>No skills found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {skills.map(skill => (
                <div key={skill} className={`ap-skill-filter${filters.includes(skill) ? ' on' : ''}`}
                  onClick={() => toggleSkill(skill)}
                  style={{ justifyContent: 'space-between' }}>
                  <span>{skill}</span>
                  {filters.includes(skill) && <span style={{ opacity: 0.6 }}><IconX /></span>}
                </div>
              ))}
            </div>
          )}

          {/* Active filters */}
          {filters.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Active filters
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filters.map(f => (
                  <span key={f} className="ap-skill"
                    style={{ cursor: 'pointer', paddingRight: 6, gap: 4 }}
                    onClick={() => toggleSkill(f)}>
                    {f} <IconX />
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Header + Search */}
          <div style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  All Projects
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                  {displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''} available
                  {filters.length > 0 ? ` · filtered by ${filters.length} skill${filters.length > 1 ? 's' : ''}` : ''}
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className="ap-search">
              <IconSearch />
              <input placeholder="Search projects by title or description…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', display: 'flex', padding: 0 }}>
                  <IconX />
                </button>
              )}
            </div>
          </div>

          {/* Project cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {displayProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px',
                background: 'white', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  No projects found
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>
                  Try adjusting your filters or search query
                </div>
              </div>
            ) : (
              displayProjects.map((project, i) => {
                const bidsCount = project.bids?.length || 0
                const avgBid = project.bidAmounts?.length > 0
                  ? (project.bidAmounts.reduce((a, b) => a + b, 0) / project.bidAmounts.length).toFixed(0)
                  : 0

                return (
                  <div key={project._id} className="ap-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => navigate(`/freelancer/project/${project._id}`)}>

                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a',
                        letterSpacing: '-0.3px', flex: 1, paddingRight: 16 }}>
                        {project.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>
                        <IconCalendar />
                        {new Date(project.postedDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>

                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65,
                      marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>

                    {/* Skills */}
                    {(project.skills || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {(project.skills || []).map(skill => (
                          <span key={skill} className="ap-skill">{skill}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', paddingTop: 14,
                      borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                          fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
                          <IconRupee />
                          ₹{project.budget?.toLocaleString('en-IN') || 0}
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>budget</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                          fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                          <IconUsers />
                          {bidsCount} bid{bidsCount !== 1 ? 's' : ''}
                        </div>
                        {avgBid > 0 && (
                          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                            Avg: ₹{Number(avgBid).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, fontWeight: 700, color: '#2563eb',
                        background: '#eff6ff', padding: '6px 14px', borderRadius: 8 }}>
                        View Project <IconArrow />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AllProjects