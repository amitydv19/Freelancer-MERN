import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

/* ── SVG Icons ─────────────────────────────────────────── */
const IconGrid     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconFolder   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const IconFile     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const IconUser     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLogout   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconEdit     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconSave     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const IconBriefcase= () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
const IconCheck    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconClipboard= () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
const IconRupee    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="12" y1="8" x2="6" y2="21"/><path d="M6 3h6a6 6 0 0 1 0 5"/></svg>
const IconX        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconPlus     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .fw * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  .fw-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #f0f4ff 0%, #f8fafc 60%, #f0fdf4 100%);
  }

  /* ── Navbar ── */
  .fw-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .fw-nav-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    border: none; background: none; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .fw-nav-link:hover { background: #f1f5f9; color: #0f172a; }
  .fw-nav-link.active { background: #eff6ff; color: #2563eb; }

  /* ── Stat cards ── */
  .fw-stat {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    padding: 24px; cursor: pointer;
    transition: all 0.25s; animation: fadeUp 0.5s ease both;
  }
  .fw-stat:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(37,99,235,0.12);
    border-color: #bfdbfe;
  }

  /* ── Profile card ── */
  .fw-card {
    background: white; border-radius: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    overflow: hidden; animation: fadeUp 0.5s 0.15s ease both;
  }

  /* ── Skill tag ── */
  .fw-skill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe; border-radius: 100px;
    padding: 5px 12px; font-size: 12px; font-weight: 600;
    transition: all 0.2s;
  }
  .fw-skill:hover { background: #dbeafe; }

  /* ── Buttons ── */
  .fw-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white; font-weight: 700; font-size: 14px;
    padding: 10px 22px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: all 0.22s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .fw-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.42); }

  .fw-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    background: white; color: #475569; font-weight: 600; font-size: 14px;
    padding: 10px 20px; border-radius: 12px; border: 1.5px solid #e2e8f0; cursor: pointer;
    transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .fw-btn-ghost:hover { background: #f8fafc; border-color: #cbd5e1; }

  .fw-btn-danger {
    display: inline-flex; align-items: center; gap: 7px;
    background: #fef2f2; color: #ef4444; font-weight: 600; font-size: 14px;
    padding: 10px 20px; border-radius: 12px; border: 1.5px solid #fecaca; cursor: pointer;
    transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .fw-btn-danger:hover { background: #fee2e2; }

  /* ── Input ── */
  .fw-input {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-size: 14px; color: #0f172a; outline: none;
    background: #f8fafc; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .fw-input:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
  .fw-input::placeholder { color: #cbd5e1; }
  .fw-label { display: block; font-size: 12.5px; font-weight: 700; color: #374155; margin-bottom: 7px; }

  /* ── Modal overlay ── */
  .fw-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.45);
    backdrop-filter: blur(4px); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .fw-modal {
    background: white; border-radius: 24px; width: 100%; max-width: 500px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.2);
    animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    overflow: hidden;
  }

  /* ── Avatar ── */
  .fw-avatar {
    width: 72px; height: 72px; border-radius: 20px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 28px; font-weight: 800;
    box-shadow: 0 8px 24px rgba(37,99,235,0.35);
    flex-shrink: 0;
  }

  /* ── Skill input ── */
  .fw-skill-input {
    display: flex; gap: 8px; align-items: center;
  }
  .fw-skill-new {
    flex: 1; padding: 10px 14px;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-size: 13px; outline: none; background: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s;
  }
  .fw-skill-new:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
`

/* ── Stat card config ─────────────────────────────────── */
const statConfig = [
  { key: 'currentProjects',   label: 'Current Projects',   icon: <IconBriefcase />, color: '#2563eb', bg: '#eff6ff',  route: '/freelancer/my-projects'    },
  { key: 'completedProjects', label: 'Completed Projects', icon: <IconCheck />,     color: '#16a34a', bg: '#f0fdf4',  route: '/freelancer/my-projects'    },
  { key: 'applications',      label: 'Applications',       icon: <IconClipboard />, color: '#7c3aed', bg: '#fdf4ff',  route: '/freelancer/myApplications' },
  { key: 'funds',             label: 'Total Funds',        icon: <IconRupee />,     color: '#d97706', bg: '#fffbeb',  route: null                         },
]

/* ── Main Component ─────────────────────────────────────── */
const Freelancer = () => {
  const navigate = useNavigate()

  const [freelancer,    setFreelancer]    = useState(null)
  const [editOpen,      setEditOpen]      = useState(false)
  const [editDesc,      setEditDesc]      = useState('')
  const [newSkill,      setNewSkill]      = useState('')
  const [skillsList,    setSkillsList]    = useState([])
  const [saving,        setSaving]        = useState(false)
  const [activeNav,     setActiveNav]     = useState('dashboard')
  const [activeTab,     setActiveTab]     = useState('basic')

  // Extended profile fields
  const [photo,         setPhoto]         = useState('')
  const [photoPreview,  setPhotoPreview]  = useState('')
  const [qualification, setQualification] = useState('')
  const [experience,    setExperience]    = useState('')
  const [hourlyRate,    setHourlyRate]    = useState('')
  const [location,      setLocation]      = useState('')
  const [github,        setGithub]        = useState('')
  const [linkedin,      setLinkedin]      = useState('')
  const [portfolio,     setPortfolio]     = useState('')
  const [languages,     setLanguages]     = useState('')
  const [availability,  setAvailability]  = useState('Full-time')

  const userId   = localStorage.getItem('userId')
  const username = localStorage.getItem('username') || 'Freelancer'

  const loadFreelancer = async () => {
    try {
      const { data } = await api.get(`/freelancer/${userId}`)
      setFreelancer(data)
      setSkillsList(data.skills || [])
      setEditDesc(data.description || '')
      setQualification(data.qualification || '')
      setExperience(data.experience || '')
      setHourlyRate(data.hourlyRate || '')
      setLocation(data.location || '')
      setGithub(data.github || '')
      setLinkedin(data.linkedin || '')
      setPortfolio(data.portfolio || '')
      setLanguages(data.languages || '')
      setAvailability(data.availability || 'Full-time')
      setPhotoPreview(data.photo || '')
    } catch (err) { console.error(err) }
  }

  useEffect(() => { if (userId) loadFreelancer() }, [userId])

  const updateProfile = async () => {
    setSaving(true)
    try {
      await api.post('/freelancer/update', {
        freelancerId: userId,
        updateSkills: skillsList,
        description:  editDesc,
        qualification, experience, hourlyRate,
        location, github, linkedin, portfolio,
        languages, availability,
        photo: photoPreview,
      })
      setEditOpen(false)
      loadFreelancer()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skillsList.includes(s)) {
      setSkillsList(prev => [...prev, s])
      setNewSkill('')
    }
  }

  const removeSkill = (skill) => setSkillsList(prev => prev.filter(s => s !== skill))

  if (!freelancer) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #e2e8f0', borderTopColor: '#2563eb',
        animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const navLinks = [
    { key: 'dashboard',    label: 'Dashboard',    icon: <IconGrid />,      action: () => { setActiveNav('dashboard'); navigate('/freelancer') } },
    { key: 'projects',     label: 'All Projects', icon: <IconFolder />,    action: () => { setActiveNav('projects');  navigate('/freelancer/all-projects') } },
    { key: 'myprojects',   label: 'My Projects',  icon: <IconFile />,      action: () => { setActiveNav('myprojects');navigate('/freelancer/my-projects') } },
    { key: 'applications', label: 'Applications', icon: <IconClipboard />, action: () => { setActiveNav('applications'); navigate('/freelancer/myApplications') } },
    { key: 'profile',      label: 'Profile',      icon: <IconUser />,      action: () => setEditOpen(true) },
  ]

  return (
    <div className="fw fw-page">
      <style>{S}</style>

      {/* ══ NAVBAR ══ */}
      <nav className="fw-nav">
        {/* Logo */}
        <span onClick={() => navigate('/')}
          style={{ fontSize: 20, fontWeight: 800, color: '#2563eb',
            cursor: 'pointer', letterSpacing: '-0.5px', flexShrink: 0 }}>
          SB Works
        </span>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(({ key, label, icon, action }) => (
            <button key={key} className={`fw-nav-link${activeNav === key ? ' active' : ''}`}
              onClick={action}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Right — user + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 12, padding: '6px 14px' }}>
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
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif',
              transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
            <IconLogout /> Logout
          </button>
        </div>
      </nav>

      {/* ══ PAGE CONTENT ══ */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 32px' }}>

        {/* Welcome banner */}
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text' }}>{username}</span> 👋
          </div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>
            Here's what's happening with your freelance work today.
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
          {statConfig.map(({ key, label, icon, color, bg, route }, i) => {
            const val = key === 'funds'
              ? `₹${freelancer.funds ?? 0}`
              : key === 'applications'
              ? 0
              : (freelancer[key]?.length ?? 0)
            return (
              <div key={key} className="fw-stat"
                style={{ animationDelay: `${i * 0.07}s`, cursor: route ? 'pointer' : 'default' }}
                onClick={() => route && navigate(route)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12,
                    background: bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color }}>
                    {icon}
                  </div>
                  {route && (
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600,
                      background: '#f8fafc', padding: '3px 8px', borderRadius: 6,
                      border: '1px solid #e2e8f0' }}>View →</span>
                  )}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 6 }}>
                  {val}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</div>
              </div>
            )
          })}
        </div>

        {/* ── PROFILE CARD ── */}
        <div className="fw-card">
          {/* Card header */}
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#4338ca)',
            padding: '28px 32px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div className="fw-avatar" style={{ overflow: 'hidden' }}>
                {freelancer.photo
                  ? <img src={freelancer.photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : username[0].toUpperCase()
                }
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>{username}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}/>
                  Available for work · Freelancer
                </div>
              </div>
            </div>
            <button className="fw-btn-primary" onClick={() => setEditOpen(true)}
              style={{ background: 'rgba(255,255,255,0.15)', boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              <IconEdit /> Edit Profile
            </button>
          </div>

          {/* Card body */}
          <div style={{ padding: '28px 32px' }}>

            {/* Top row — photo + info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 24 }}>

              {/* Skills */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
                  letterSpacing: '0.08em', marginBottom: 14 }}>Skills</div>
                {freelancer.skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {freelancer.skills.map(skill => (
                      <span key={skill} className="fw-skill">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic' }}>
                    No skills added yet — <span style={{ color: '#2563eb', cursor: 'pointer',
                      fontStyle: 'normal', fontWeight: 600 }} onClick={() => setEditOpen(true)}>Add skills</span>
                  </div>
                )}
              </div>

              {/* About */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
                  letterSpacing: '0.08em', marginBottom: 14 }}>About</div>
                <p style={{ fontSize: 14, color: freelancer.description ? '#334155' : '#94a3b8',
                  lineHeight: 1.7, fontStyle: freelancer.description ? 'normal' : 'italic' }}>
                  {freelancer.description || 'No description added yet. Tell clients about yourself.'}
                </p>
              </div>
            </div>

            {/* Info pills row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24,
              paddingBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
              {[
                { icon: '🎓', label: freelancer.qualification || 'Add qualification' },
                { icon: '💼', label: freelancer.experience   || 'Add experience' },
                { icon: '💰', label: freelancer.hourlyRate   ? `₹${freelancer.hourlyRate}/hr` : 'Add rate' },
                { icon: '📍', label: freelancer.location     || 'Add location' },
                { icon: '🌐', label: freelancer.languages    || 'Add languages' },
                { icon: '⏰', label: freelancer.availability || 'Full-time' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6,
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 100,
                  padding: '6px 14px', fontSize: 13, fontWeight: 500, color: '#475569' }}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>

            {/* Links + stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              {/* Social links */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'GitHub',    url: freelancer.github,    icon: '🐙' },
                  { label: 'LinkedIn',  url: freelancer.linkedin,  icon: '💼' },
                  { label: 'Portfolio', url: freelancer.portfolio, icon: '🌐' },
                ].map(({ label, url, icon }) => url ? (
                  <a key={label} href={url} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6,
                      background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                      borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700,
                      textDecoration: 'none', transition: 'all 0.2s' }}>
                    {icon} {label}
                  </a>
                ) : null)}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 28 }}>
                {[
                  { label: 'Member since', val: new Date(freelancer.createdAt || Date.now()).getFullYear() },
                  { label: 'Profile views', val: '—' },
                  { label: 'Response rate', val: '—' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{val}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ EDIT PROFILE MODAL ══ */}
      {editOpen && (
        <div className="fw-overlay" onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="fw-modal" style={{ maxWidth: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

            {/* Modal header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Edit Profile</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Keep your profile complete to attract more clients</div>
              </div>
              <button onClick={() => setEditOpen(false)}
                style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                <IconX />
              </button>
            </div>

            {/* Tab nav */}
            <div style={{ display: 'flex', gap: 4, padding: '12px 28px 0', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
              {[
                { key: 'basic',   label: '👤 Basic Info' },
                { key: 'skills',  label: '🛠️ Skills' },
                { key: 'links',   label: '🔗 Links' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{ padding: '8px 16px', borderRadius: '10px 10px 0 0', border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    background: activeTab === key ? 'white' : 'transparent',
                    color: activeTab === key ? '#2563eb' : '#64748b',
                    borderBottom: activeTab === key ? '2px solid #2563eb' : '2px solid transparent',
                    marginBottom: -1 }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Scrollable body */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>

              {/* ── TAB: BASIC ── */}
              {activeTab === 'basic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                  {/* Photo upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 80, height: 80, borderRadius: 20,
                        background: photoPreview ? 'transparent' : 'linear-gradient(135deg,#2563eb,#7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', border: '3px solid #e2e8f0',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.2)' }}>
                        {photoPreview
                          ? <img src={photoPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>{username[0].toUpperCase()}</span>
                        }
                      </div>
                      <label htmlFor="photo-upload" style={{ position: 'absolute', bottom: -4, right: -4,
                        width: 26, height: 26, borderRadius: '50%', background: '#2563eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </label>
                      <input id="photo-upload" type="file" accept="image/*"
                        style={{ display: 'none' }} onChange={handlePhotoChange} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Profile Photo</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                        Upload a clear professional photo.<br/>JPG, PNG — max 2MB recommended.
                      </div>
                      {photoPreview && (
                        <button onClick={() => setPhotoPreview('')}
                          style={{ marginTop: 6, fontSize: 11, color: '#ef4444', fontWeight: 600,
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <label className="fw-label">About / Bio</label>
                    <textarea className="fw-input" rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }}
                      placeholder="Tell clients about your experience and expertise..."
                      value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                  </div>

                  {/* 2-col grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label className="fw-label">Qualification</label>
                      <input className="fw-input" placeholder="e.g. B.Tech Computer Science"
                        value={qualification} onChange={e => setQualification(e.target.value)} />
                    </div>
                    <div>
                      <label className="fw-label">Experience</label>
                      <select className="fw-input" value={experience} onChange={e => setExperience(e.target.value)}
                        style={{ cursor: 'pointer', appearance: 'none' }}>
                        <option value="">Select experience</option>
                        <option>Less than 1 year</option>
                        <option>1–2 years</option>
                        <option>2–4 years</option>
                        <option>4–6 years</option>
                        <option>6+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="fw-label">Hourly Rate (₹/hr)</label>
                      <input className="fw-input" type="number" placeholder="e.g. 500"
                        value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                    </div>
                    <div>
                      <label className="fw-label">Location</label>
                      <input className="fw-input" placeholder="e.g. Lucknow, India"
                        value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <div>
                      <label className="fw-label">Languages</label>
                      <input className="fw-input" placeholder="e.g. English, Hindi"
                        value={languages} onChange={e => setLanguages(e.target.value)} />
                    </div>
                    <div>
                      <label className="fw-label">Availability</label>
                      <select className="fw-input" value={availability} onChange={e => setAvailability(e.target.value)}
                        style={{ cursor: 'pointer', appearance: 'none' }}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Weekends only</option>
                        <option>Not available</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: SKILLS ── */}
              {activeTab === 'skills' && (
                <div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
                    Add skills that best represent your expertise. Clients filter by skills to find freelancers.
                  </div>
                  {skillsList.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                      {skillsList.map(s => (
                        <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                          borderRadius: 100, padding: '5px 10px 5px 14px', fontSize: 13, fontWeight: 600 }}>
                          {s}
                          <button onClick={() => removeSkill(s)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer',
                              color: '#93c5fd', display: 'flex', padding: 0, transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = '#93c5fd'}>
                            <IconX />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="fw-skill-input">
                    <input className="fw-skill-new" placeholder="Type a skill e.g. React, Figma, Python…"
                      value={newSkill} onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                    <button onClick={addSkill}
                      style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                        border: 'none', cursor: 'pointer', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 3px 10px rgba(37,99,235,0.35)' }}>
                      <IconPlus />
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                    Press Enter or click + to add · Click × on a tag to remove it
                  </div>

                  {/* Popular skills quick-add */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                      Popular skills — click to add
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {['React', 'Node.js', 'Python', 'Figma', 'MongoDB', 'TypeScript',
                        'Next.js', 'Flutter', 'AWS', 'PostgreSQL', 'Vue.js', 'Docker'].map(s => (
                        <span key={s} onClick={() => {
                          if (!skillsList.includes(s)) setSkillsList(prev => [...prev, s])
                        }}
                          style={{ background: skillsList.includes(s) ? '#eff6ff' : '#f8fafc',
                            color: skillsList.includes(s) ? '#2563eb' : '#64748b',
                            border: `1px solid ${skillsList.includes(s) ? '#bfdbfe' : '#e2e8f0'}`,
                            borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600,
                            cursor: skillsList.includes(s) ? 'default' : 'pointer',
                            transition: 'all 0.2s' }}>
                          {skillsList.includes(s) ? '✓ ' : '+ '}{s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: LINKS ── */}
              {activeTab === 'links' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                    Add your professional links so clients can verify your work and background.
                  </div>
                  {[
                    { label: 'GitHub', icon: '🐙', val: github,    set: setGithub,    placeholder: 'https://github.com/username' },
                    { label: 'LinkedIn', icon: '💼', val: linkedin, set: setLinkedin, placeholder: 'https://linkedin.com/in/username' },
                    { label: 'Portfolio / Website', icon: '🌐', val: portfolio, set: setPortfolio, placeholder: 'https://yourportfolio.com' },
                  ].map(({ label, icon, val, set, placeholder }) => (
                    <div key={label}>
                      <label className="fw-label">{icon} {label}</label>
                      <input className="fw-input" type="url" placeholder={placeholder}
                        value={val} onChange={e => set(e.target.value)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid #f1f5f9',
              display: 'flex', gap: 10, flexShrink: 0, background: '#fafafa' }}>
              <button className="fw-btn-primary" onClick={updateProfile} disabled={saving}
                style={{ flex: 1, justifyContent: 'center' }}>
                <IconSave /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button className="fw-btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Freelancer