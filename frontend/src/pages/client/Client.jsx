import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .cl * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes blobFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(25px,-15px) scale(1.04); }
  }
  @keyframes blobFloat2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-15px,20px) scale(1.03); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(0.8); }
  }

  .cl-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #eef2ff 0%, #f0f9ff 50%, #faf5ff 100%);
    position: relative; overflow-x: hidden;
  }

  /* Blobs */
  .cl-blob1 {
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
    top: -200px; left: -150px; pointer-events: none;
    animation: blobFloat1 12s ease-in-out infinite;
  }
  .cl-blob2 {
    position: fixed; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
    bottom: -150px; right: -120px; pointer-events: none;
    animation: blobFloat2 14s ease-in-out infinite;
  }

  /* Navbar */
  .cl-navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 24px rgba(0,0,0,0.06);
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 32px; height: 64px;
  }

  /* Main layout */
  .cl-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 0;
    min-height: calc(100vh - 64px);
    position: relative; z-index: 1;
  }

  /* Sidebar */
  .cl-sidebar {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(226,232,240,0.8);
    padding: 28px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: sticky; top: 64px; height: calc(100vh - 64px);
    overflow-y: auto;
  }

  .cl-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 12px;
    font-size: 14px; font-weight: 600; color: #64748b;
    cursor: pointer; transition: all 0.2s; border: none;
    background: none; width: 100%; text-align: left;
  }
  .cl-nav-item:hover { background: #f1f5f9; color: #0f172a; }
  .cl-nav-item.active {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    color: #2563eb;
    box-shadow: 0 2px 8px rgba(37,99,235,0.12);
  }
  .cl-nav-label {
    font-size: 10px; font-weight: 700; color: #94a3b8;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 16px 14px 8px;
  }

  /* Main content */
  .cl-main { padding: 32px 36px; overflow-y: auto; }

  /* Page header */
  .cl-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 28px;
    animation: fadeUp 0.5s ease both;
  }

  /* Stats row */
  .cl-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 28px;
  }
  .cl-stat {
    background: white; border-radius: 18px; padding: 20px 22px;
    border: 1px solid rgba(226,232,240,0.8);
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    animation: fadeUp 0.5s ease both;
    transition: all 0.25s;
  }
  .cl-stat:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.1);
  }

  /* Filter bar */
  .cl-filterbar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 20px;
    animation: fadeUp 0.5s 0.1s ease both;
    flex-wrap: wrap;
  }
  .cl-filter-btn {
    padding: 8px 18px; border-radius: 100px;
    font-size: 13px; font-weight: 600;
    border: 1.5px solid #e2e8f0; background: white;
    color: #64748b; cursor: pointer; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .cl-filter-btn:hover { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }
  .cl-filter-btn.active {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white; border-color: transparent;
    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  }

  /* Project cards */
  .cl-card {
    background: white; border-radius: 20px; padding: 24px 26px;
    border: 1px solid rgba(226,232,240,0.9);
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    cursor: pointer; transition: all 0.28s;
    animation: fadeUp 0.5s ease both;
    position: relative; overflow: hidden;
    margin-bottom: 14px;
  }
  .cl-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 4px; border-radius: 4px 0 0 4px;
    background: linear-gradient(180deg, #2563eb, #7c3aed);
    opacity: 0; transition: opacity 0.25s;
  }
  .cl-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(37,99,235,0.12);
    border-color: #bfdbfe;
  }
  .cl-card:hover::before { opacity: 1; }

  /* Status badges */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    font-size: 12px; font-weight: 700;
  }
  .badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }
  .badge-available {
    background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;
  }
  .badge-available .badge-dot { background: #22c55e; animation: pulse-dot 2s infinite; }
  .badge-assigned {
    background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
  }
  .badge-assigned .badge-dot { background: #3b82f6; }
  .badge-completed {
    background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;
  }
  .badge-completed .badge-dot { background: #8b5cf6; }

  /* Primary button */
  .cl-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white; font-weight: 700; font-size: 14px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: all 0.22s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .cl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.45); }

  /* Empty state */
  .cl-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 20px; text-align: center;
    animation: fadeIn 0.5s ease both;
  }

  /* Skeleton loader */
  .skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 600px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 10px;
  }

  /* Avatar */
  .cl-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 800; font-size: 15px; flex-shrink: 0;
  }

  /* Logout btn */
  .cl-logout {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px; border: 1.5px solid #fecaca;
    background: white; color: #ef4444; font-weight: 600; font-size: 13px;
    cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .cl-logout:hover { background: #fef2f2; border-color: #ef4444; }

  /* Divider */
  .cl-divider { height: 1px; background: #f1f5f9; margin: 8px 0; }

  @media (max-width: 900px) {
    .cl-layout { grid-template-columns: 1fr; }
    .cl-sidebar { display: none; }
    .cl-stats { grid-template-columns: repeat(2, 1fr); }
    .cl-main { padding: 20px 16px; }
  }
`

/* ── Icons ── */
const Icon = ({ d, size = 16, color = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  grid:    'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  plus:    'M12 5v14M5 12h14',
  filter:  'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  clock:   'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5v5l3 3',
  check:   'M20 6 9 17l-5-5',
  logout:  'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  home:    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  chevron: 'M9 18l6-6-6-6',
  rupee:   'M6 3h12M6 8h12M9 3v18M9 8c3.33 0 6 .67 6 4s-3.33 4.33-6 4.33',
  user:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  bell:    'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
}

const statusConfig = {
  Available: { label: 'Open',        cls: 'badge-available' },
  Assigned:  { label: 'In Progress', cls: 'badge-assigned'  },
  Completed: { label: 'Completed',   cls: 'badge-completed' },
}

/* ── Component ── */
const Client = () => {
  const navigate = useNavigate()
  const [projects, setProjects]               = useState([])
  const [displayProjects, setDisplayProjects] = useState([])
  const [activeFilter, setActiveFilter]       = useState('All')
  const [loading, setLoading]                 = useState(true)

  const username = localStorage.getItem('username') || 'Client'
  const initial  = username[0]?.toUpperCase()

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/project/')
      const mine = data.filter(p => p.clientId === localStorage.getItem('userId'))
      setProjects(mine)
      setDisplayProjects([...mine].reverse())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const filterMap = {
    'All':         null,
    'Open':        'Available',
    'In Progress': 'Assigned',
    'Completed':   'Completed',
  }

  const handleFilter = (label) => {
    setActiveFilter(label)
    const status = filterMap[label]
    setDisplayProjects(
      status ? [...projects].filter(p => p.status === status).reverse()
             : [...projects].reverse()
    )
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  // Stats
  const total     = projects.length
  const open      = projects.filter(p => p.status === 'Available').length
  const inProg    = projects.filter(p => p.status === 'Assigned').length
  const completed = projects.filter(p => p.status === 'Completed').length

  const stats = [
    { label: 'Total Projects', value: total,     color: '#2563eb', bg: '#eff6ff',  icon: icons.grid  },
    { label: 'Open',           value: open,      color: '#16a34a', bg: '#f0fdf4',  icon: icons.clock },
    { label: 'In Progress',    value: inProg,    color: '#d97706', bg: '#fffbeb',  icon: icons.filter},
    { label: 'Completed',      value: completed, color: '#7c3aed', bg: '#f5f3ff',  icon: icons.check },
  ]

  return (
    <div className="cl cl-page">
      <style>{S}</style>
      <div className="cl-blob1"/><div className="cl-blob2"/>

      {/* ── NAVBAR ── */}
      <nav className="cl-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span onClick={() => navigate('/')}
            style={{ fontSize: 20, fontWeight: 800, color: '#2563eb',
              cursor: 'pointer', letterSpacing: '-0.5px' }}>
            SB Works
          </span>
          <span style={{ color: '#e2e8f0', fontSize: 18 }}>›</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>Client</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 12, padding: '7px 14px' }}>
            <div className="cl-avatar" style={{ width: 28, height: 28, fontSize: 12, borderRadius: 8 }}>
              {initial}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{username}</span>
          </div>
          <button className="cl-logout" onClick={logout}>
            <Icon d={icons.logout} size={14} color="#ef4444"/>
            Logout
          </button>
        </div>
      </nav>

      {/* ── LAYOUT ── */}
      <div className="cl-layout">

        {/* ── SIDEBAR ── */}
        <aside className="cl-sidebar">
          <div style={{ padding: '4px 14px 16px', marginBottom: 4 }}>
            <div className="cl-avatar" style={{ marginBottom: 10 }}>{initial}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{username}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Client Account</div>
          </div>

          <div className="cl-divider"/>

          <div className="cl-nav-label">Menu</div>

          {[
            { label: 'My Projects',  icon: icons.grid,  active: true,  action: () => {} },
            { label: 'Post Project', icon: icons.plus,  active: false, action: () => navigate('/new-project') },
            { label: 'Home',         icon: icons.home,  active: false, action: () => navigate('/') },
          ].map(({ label, icon, active, action }) => (
            <button key={label}
              className={`cl-nav-item${active ? ' active' : ''}`}
              onClick={action}>
              <Icon d={icon} size={16} color={active ? '#2563eb' : '#94a3b8'}/>
              {label}
            </button>
          ))}

          <div className="cl-divider" style={{ marginTop: 'auto' }}/>

          <button className="cl-nav-item" onClick={logout}
            style={{ color: '#ef4444', marginTop: 4 }}>
            <Icon d={icons.logout} size={16} color="#ef4444"/>
            Logout
          </button>
        </aside>

        {/* ── MAIN ── */}
        <main className="cl-main">

          {/* Header */}
          <div className="cl-header">
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a',
                letterSpacing: '-0.5px', margin: '0 0 4px' }}>
                My Projects
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
                Manage and track all your posted projects
              </p>
            </div>
            <button className="cl-btn" onClick={() => navigate('/new-project')}>
              <Icon d={icons.plus} size={16} color="white"/>
              Post New Project
            </button>
          </div>

          {/* Stats */}
          <div className="cl-stats">
            {stats.map(({ label, value, color, bg, icon }, i) => (
              <div className="cl-stat" key={label}
                style={{ animationDelay: `${i * 0.07}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12,
                    background: bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center' }}>
                    <Icon d={icon} size={18} color={color}/>
                  </div>
                  <span style={{ fontSize: 24, fontWeight: 800, color }}>{value}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Filter buttons */}
          <div className="cl-filterbar">
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginRight: 4 }}>
              Filter:
            </span>
            {['All', 'Open', 'In Progress', 'Completed'].map(f => (
              <button key={f}
                className={`cl-filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => handleFilter(f)}>
                {f}
                <span style={{
                  marginLeft: 6, fontSize: 11, fontWeight: 700,
                  background: activeFilter === f ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: activeFilter === f ? 'white' : '#64748b',
                  padding: '1px 7px', borderRadius: 100,
                }}>
                  {f === 'All' ? total
                   : f === 'Open' ? open
                   : f === 'In Progress' ? inProg
                   : completed}
                </span>
              </button>
            ))}
          </div>

          {/* Project list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: 'white', borderRadius: 20,
                  padding: 24, border: '1px solid #e2e8f0' }}>
                  <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 12 }}/>
                  <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }}/>
                  <div className="skeleton" style={{ height: 14, width: '60%' }}/>
                </div>
              ))}
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="cl-empty">
              <div style={{ width: 80, height: 80, borderRadius: 24,
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, fontSize: 36 }}>
                📋
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a',
                margin: '0 0 8px' }}>No projects found</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>
                {activeFilter === 'All'
                  ? "You haven't posted any projects yet."
                  : `No ${activeFilter.toLowerCase()} projects at the moment.`}
              </p>
              {activeFilter === 'All' && (
                <button className="cl-btn" onClick={() => navigate('/new-project')}>
                  <Icon d={icons.plus} size={16} color="white"/>
                  Post Your First Project
                </button>
              )}
            </div>
          ) : (
            <div>
              {displayProjects.map((project, i) => {
                const sc = statusConfig[project.status] || { label: project.status, cls: 'badge-available' }
                return (
                  <div key={project._id} className="cl-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => navigate(`/client-project/${project._id}`)}>

                    {/* Top row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ flex: 1, paddingRight: 16 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a',
                          margin: '0 0 4px', lineHeight: 1.3 }}>
                          {project.title}
                        </h3>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                          Posted {String(project.postedDate).slice(0, 15)}
                        </span>
                      </div>
                      <span className={`badge ${sc.cls}`}>
                        <span className="badge-dot"/>
                        {sc.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65,
                      margin: '0 0 16px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', paddingTop: 14,
                      borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8,
                          background: '#f0fdf4', display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
                          <Icon d={icons.rupee} size={14} color="#16a34a"/>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                          ₹{Number(project.budget).toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>budget</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                        color: '#2563eb', fontSize: 13, fontWeight: 600 }}>
                        View Details
                        <Icon d={icons.chevron} size={14} color="#2563eb"/>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Client