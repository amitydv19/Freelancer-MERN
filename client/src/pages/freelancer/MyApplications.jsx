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
const IconCheck     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconX         = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconClock     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconRupee     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="12" y1="8" x2="6" y2="21"/><path d="M6 3h6a6 6 0 0 1 0 5"/></svg>
const IconSend      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .ma * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ma-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #f0f4ff 0%, #f8fafc 60%, #f0fdf4 100%);
  }

  /* Navbar */
  .ma-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ma-nav-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    border: none; background: none; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ma-nav-link:hover { background: #f1f5f9; color: #0f172a; }
  .ma-nav-link.active { background: #eff6ff; color: #2563eb; }

  /* App card */
  .ma-card {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    overflow: hidden; transition: all 0.25s;
    animation: fadeUp 0.4s ease both;
  }
  .ma-card:hover {
    box-shadow: 0 8px 32px rgba(37,99,235,0.1);
    border-color: #bfdbfe; transform: translateY(-2px);
  }

  /* Skill tags */
  .ma-skill-blue {
    display: inline-flex; align-items: center;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe; border-radius: 100px;
    padding: 3px 10px; font-size: 11.5px; font-weight: 600;
  }
  .ma-skill-gray {
    display: inline-flex; align-items: center;
    background: #f8fafc; color: #64748b;
    border: 1px solid #e2e8f0; border-radius: 100px;
    padding: 3px 10px; font-size: 11.5px; font-weight: 600;
  }

  /* Status badge */
  .ma-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 100px;
  }

  /* Filter tabs */
  .ma-tab {
    padding: 8px 18px; border-radius: 10px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: 1.5px solid #e2e8f0;
    background: white; color: #64748b; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ma-tab:hover { border-color: #93c5fd; color: #2563eb; background: #f0f9ff; }
  .ma-tab.active { background: #eff6ff; color: #2563eb; border-color: #2563eb; }
`

/* ── Status config ─────────────────────────────────────── */
const statusConfig = {
  Accepted: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: <IconCheck /> },
  Rejected: { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', icon: <IconX />     },
  Pending:  { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: <IconClock /> },
}

const MyApplications = () => {
  const navigate    = useNavigate()
  const userId      = localStorage.getItem('userId')
  const username    = localStorage.getItem('username') || 'Freelancer'

  const [applications, setApplications] = useState([])
  const [activeTab,    setActiveTab]    = useState('All')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/application')
        const mine = data.filter(a => a.freelancerId === userId)
        setApplications([...mine].reverse())
      } catch (err) { console.error(err) }
    }
    fetch()
  }, [])

  const logout = () => { localStorage.clear(); navigate('/') }

  const tabs    = ['All', 'Pending', 'Accepted', 'Rejected']
  const filtered = activeTab === 'All'
    ? applications
    : applications.filter(a => a.status === activeTab)

  const counts = {
    All:      applications.length,
    Pending:  applications.filter(a => a.status === 'Pending').length,
    Accepted: applications.filter(a => a.status === 'Accepted').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  }

  const navLinks = [
    { key: 'dashboard',    label: 'Dashboard',    icon: <IconGrid />,      path: '/freelancer' },
    { key: 'projects',     label: 'All Projects', icon: <IconFolder />,    path: '/freelancer/all-projects' },
    { key: 'myprojects',   label: 'My Projects',  icon: <IconFile />,      path: '/freelancer/my-projects' },
    { key: 'applications', label: 'Applications', icon: <IconClipboard />, path: '/freelancer/myApplications' },
    { key: 'profile',      label: 'Profile',      icon: <IconUser />,      path: '/freelancer' },
  ]

  return (
    <div className="ma ma-page">
      <style>{S}</style>

      {/* ── NAVBAR ── */}
      <nav className="ma-nav">
        <span onClick={() => navigate('/')}
          style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', cursor: 'pointer', letterSpacing: '-0.5px' }}>
          SB Works
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(({ key, label, icon, path }) => (
            <button key={key} className={`ma-nav-link${key === 'applications' ? ' active' : ''}`}
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
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>
            My Applications
          </h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            Track all your project proposals and their status
          </p>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
          animation: 'fadeUp 0.4s 0.05s ease both' }}>
          {[
            { label: 'Total',    val: counts.All,      bg: '#f8fafc',  color: '#475569', border: '#e2e8f0' },
            { label: 'Pending',  val: counts.Pending,  bg: '#fffbeb',  color: '#d97706', border: '#fde68a' },
            { label: 'Accepted', val: counts.Accepted, bg: '#f0fdf4',  color: '#16a34a', border: '#bbf7d0' },
            { label: 'Rejected', val: counts.Rejected, bg: '#fef2f2',  color: '#ef4444', border: '#fecaca' },
          ].map(({ label, val, bg, color, border }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`,
              borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color }}>{val}</span>
              <span style={{ fontSize: 12, color, fontWeight: 600, opacity: 0.8 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24,
          animation: 'fadeUp 0.4s 0.1s ease both' }}>
          {tabs.map(tab => (
            <button key={tab} className={`ma-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab}
              {counts[tab] > 0 && (
                <span style={{ marginLeft: 6, background: activeTab === tab ? '#2563eb' : '#e2e8f0',
                  color: activeTab === tab ? 'white' : '#64748b',
                  borderRadius: '100px', padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Application cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px',
              background: 'white', borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                No applications yet
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>
                Browse projects and submit your first proposal
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
            filtered.map((app, i) => {
              const st = statusConfig[app.status] || statusConfig.Pending
              return (
                <div key={app._id} className="ma-card" style={{ animationDelay: `${i * 0.06}s` }}>

                  {/* Card header */}
                  <div style={{ padding: '20px 24px 16px',
                    borderBottom: '1px solid #f8fafc',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a',
                        letterSpacing: '-0.3px', marginBottom: 6 }}>
                        {app.title}
                      </h3>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {app.description}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="ma-status" style={{ flexShrink: 0, marginLeft: 16,
                      background: st.bg, color: st.color,
                      border: `1px solid ${st.border}` }}>
                      {st.icon} {app.status}
                    </div>
                  </div>

                  {/* Card body — two cols */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: 0, padding: '0' }}>

                    {/* Project side */}
                    <div style={{ padding: '18px 24px',
                      borderRight: '1px solid #f8fafc' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        Project Details
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 14, fontWeight: 700, color: '#16a34a', marginBottom: 12 }}>
                        <IconRupee /> ₹{app.budget?.toLocaleString('en-IN') || 0}
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>budget</span>
                      </div>
                      {(app.requiredSkills || []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {(app.requiredSkills || []).map(s => (
                            <span key={s} className="ma-skill-gray">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Proposal side */}
                    <div style={{ padding: '18px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        My Proposal
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 14, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>
                        <IconSend /> ₹{app.bidAmount?.toLocaleString('en-IN') || 0}
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>proposed</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6,
                        marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {app.proposal}
                      </p>
                      {(app.freelancerSkills || []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {(app.freelancerSkills || []).map(s => (
                            <span key={s} className="ma-skill-blue">{s}</span>
                          ))}
                        </div>
                      )}
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

export default MyApplications