import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

/* ── Icons ─────────────────────────────────────────────── */
const IconGrid      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconFolder    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const IconFile      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const IconUser      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconClipboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
const IconLogout    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconCalendar  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconRupee     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="12" y1="8" x2="6" y2="21"/><path d="M6 3h6a6 6 0 0 1 0 5"/></svg>
const IconArrow     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IconZap       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IconCheckCircle = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .mp * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .mp-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #f0f4ff 0%, #f8fafc 60%, #f0fdf4 100%);
  }

  /* Navbar */
  .mp-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .mp-nav-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    border: none; background: none; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .mp-nav-link:hover { background: #f1f5f9; color: #0f172a; }
  .mp-nav-link.active { background: #eff6ff; color: #2563eb; }

  /* Project card */
  .mp-card {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    padding: 24px; cursor: pointer;
    transition: all 0.25s; animation: fadeUp 0.4s ease both;
    position: relative; overflow: hidden;
  }
  .mp-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 4px; border-radius: 4px 0 0 4px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    opacity: 0; transition: opacity 0.2s;
  }
  .mp-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(37,99,235,0.11);
    border-color: #bfdbfe;
  }
  .mp-card:hover::before { opacity: 1; }

  /* Filter tab */
  .mp-tab {
    padding: 8px 18px; border-radius: 10px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: 1.5px solid #e2e8f0;
    background: white; color: #64748b; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .mp-tab:hover { border-color: #93c5fd; color: #2563eb; background: #f0f9ff; }
  .mp-tab.active { background: #eff6ff; color: #2563eb; border-color: #2563eb; }
`

/* ── Status config ─────────────────────────────────────── */
const statusConfig = {
  Assigned:  { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', icon: <IconZap />,         label: 'In Progress' },
  Completed: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: <IconCheckCircle />, label: 'Completed'   },
}

const MyProjects = () => {
  const navigate  = useNavigate()
  const userId    = localStorage.getItem('userId')
  const username  = localStorage.getItem('username') || 'Freelancer'

  const [projects,        setProjects]        = useState([])
  const [displayProjects, setDisplayProjects] = useState([])
  const [activeTab,       setActiveTab]       = useState('All')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/project')
        const mine = data.filter(p => p.freelancerId?.toString() === userId)
        setProjects(mine)
        setDisplayProjects([...mine].reverse())
      } catch (err) { console.error(err) }
    }
    fetch()
  }, [])

  const handleTab = (tab) => {
    setActiveTab(tab)
    if (tab === 'All')        setDisplayProjects([...projects].reverse())
    else if (tab === 'In Progress') setDisplayProjects(projects.filter(p => p.status === 'Assigned').reverse())
    else if (tab === 'Completed')   setDisplayProjects(projects.filter(p => p.status === 'Completed').reverse())
  }

  const logout = () => { localStorage.clear(); navigate('/') }

  const counts = {
    All:         projects.length,
    'In Progress': projects.filter(p => p.status === 'Assigned').length,
    Completed:   projects.filter(p => p.status === 'Completed').length,
  }

  const navLinks = [
    { key: 'dashboard',    label: 'Dashboard',    icon: <IconGrid />,      path: '/freelancer' },
    { key: 'projects',     label: 'All Projects', icon: <IconFolder />,    path: '/freelancer/all-projects' },
    { key: 'myprojects',   label: 'My Projects',  icon: <IconFile />,      path: '/freelancer/my-projects' },
    { key: 'applications', label: 'Applications', icon: <IconClipboard />, path: '/freelancer/myApplications' },
    { key: 'profile',      label: 'Profile',      icon: <IconUser />,      path: '/freelancer' },
  ]

  return (
    <div className="mp mp-page">
      <style>{S}</style>

      {/* ── NAVBAR ── */}
      <nav className="mp-nav">
        <span onClick={() => navigate('/')}
          style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', cursor: 'pointer', letterSpacing: '-0.5px' }}>
          SB Works
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(({ key, label, icon, path }) => (
            <button key={key} className={`mp-nav-link${key === 'myprojects' ? ' active' : ''}`}
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

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.5px', marginBottom: 6 }}>
            My Projects
          </h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            Projects you are currently working on or have completed
          </p>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
          animation: 'fadeUp 0.4s 0.05s ease both' }}>
          {[
            { label: 'Total',       val: counts.All,           bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
            { label: 'In Progress', val: counts['In Progress'], bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
            { label: 'Completed',   val: counts.Completed,     bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
          ].map(({ label, val, bg, color, border }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`,
              borderRadius: 12, padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color }}>{val}</span>
              <span style={{ fontSize: 12, color, fontWeight: 600, opacity: 0.8 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24,
          animation: 'fadeUp 0.4s 0.1s ease both' }}>
          {['All', 'In Progress', 'Completed'].map(tab => (
            <button key={tab} className={`mp-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => handleTab(tab)}>
              {tab}
              {counts[tab] > 0 && (
                <span style={{ marginLeft: 6,
                  background: activeTab === tab ? '#2563eb' : '#e2e8f0',
                  color: activeTab === tab ? 'white' : '#64748b',
                  borderRadius: '100px', padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {displayProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px',
              background: 'white', borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                No projects yet
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>
                Projects assigned to you will appear here
              </div>
              <button onClick={() => navigate('/freelancer/all-projects')}
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  color: 'white', fontWeight: 700, fontSize: 14,
                  padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}>
                Browse Projects →
              </button>
            </div>
          ) : (
            displayProjects.map((project, i) => {
              const st = statusConfig[project.status] || statusConfig.Assigned
              return (
                <div key={project._id} className="mp-card"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => navigate(`/freelancer/project/${project._id}`)}>

                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 10 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a',
                      letterSpacing: '-0.3px', flex: 1, paddingRight: 16 }}>
                      {project.title}
                    </h3>
                    {/* Status badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 100,
                      flexShrink: 0, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {st.icon} {st.label}
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65,
                    marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
                        <IconRupee /> ₹{project.budget?.toLocaleString('en-IN') || 0}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                        <IconCalendar />
                        {new Date(project.postedDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 13, fontWeight: 700, color: '#2563eb',
                      background: '#eff6ff', padding: '6px 14px', borderRadius: 8 }}>
                      Open <IconArrow />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProjects