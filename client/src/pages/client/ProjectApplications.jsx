import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .pa * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blobFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(25px,-15px) scale(1.04); }
  }
  @keyframes blobFloat2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-15px,20px) scale(1.03); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.75); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  /* ── Page ── */
  .pa-page {
    min-height: 100vh;
    background: linear-gradient(145deg,#eef2ff 0%,#f0f9ff 50%,#faf5ff 100%);
    position: relative; overflow-x: hidden;
  }
  .pa-blob1 {
    position: fixed; width: 580px; height: 580px; border-radius: 50%;
    background: radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%);
    top:-180px; left:-140px; pointer-events:none;
    animation: blobFloat1 12s ease-in-out infinite;
  }
  .pa-blob2 {
    position: fixed; width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%);
    bottom:-130px; right:-110px; pointer-events:none;
    animation: blobFloat2 14s ease-in-out infinite;
  }

  /* ── Navbar ── */
  .pa-navbar {
    position: sticky; top:0; z-index:100;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 24px rgba(0,0,0,0.06);
    display: flex; justify-content:space-between; align-items:center;
    padding: 0 32px; height: 64px;
  }
  .pa-nav-logo {
    font-size:20px; font-weight:800; color:#2563eb;
    cursor:pointer; letter-spacing:-0.5px;
  }
  .pa-nav-sep { color:#e2e8f0; font-size:18px; }
  .pa-nav-link {
    font-size:14px; font-weight:600; color:#64748b;
    cursor:pointer; transition:color 0.2s;
  }
  .pa-nav-link:hover { color:#2563eb; }
  .pa-nav-active { color:#2563eb !important; }
  .pa-nav-user {
    display:flex; align-items:center; gap:8px;
    background:#f8fafc; border:1px solid #e2e8f0;
    border-radius:12px; padding:7px 14px;
  }
  .pa-nav-avatar {
    width:28px; height:28px; border-radius:8px;
    background:linear-gradient(135deg,#2563eb,#7c3aed);
    display:flex; align-items:center; justify-content:center;
    color:white; font-weight:800; font-size:12px;
  }

  /* ── Main ── */
  .pa-main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; position:relative; z-index:1; }

  /* ── Header ── */
  .pa-header {
    display: flex; align-items:flex-start; justify-content:space-between;
    margin-bottom: 28px; animation: fadeUp 0.4s ease both;
    flex-wrap: wrap; gap: 16px;
  }

  /* ── Stats ── */
  .pa-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 14px; margin-bottom: 24px;
  }
  .pa-stat {
    background: white; border-radius: 16px; padding: 18px 20px;
    border: 1px solid rgba(226,232,240,0.8);
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    animation: fadeUp 0.4s ease both; transition: all 0.25s;
  }
  .pa-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(37,99,235,0.1); }

  /* ── Filter pills ── */
  .pa-filters {
    display: flex; gap: 8px; flex-wrap: wrap;
    margin-bottom: 20px; animation: fadeUp 0.4s 0.1s ease both;
  }
  .pa-pill {
    padding: 7px 16px; border-radius: 100px; font-size: 13px; font-weight: 600;
    border: 1.5px solid #e2e8f0; background: white; color: #64748b;
    cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans',sans-serif;
    white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis;
  }
  .pa-pill:hover { border-color: #93c5fd; color: #2563eb; background: #eff6ff; }
  .pa-pill.active {
    background: linear-gradient(135deg,#2563eb,#1d4ed8);
    color: white; border-color: transparent;
    box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  }

  /* ── App card ── */
  .pa-card {
    background: white; border-radius: 22px;
    border: 1px solid rgba(226,232,240,0.9);
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    overflow: hidden; margin-bottom: 16px;
    animation: fadeUp 0.45s ease both;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .pa-card:hover { box-shadow: 0 12px 40px rgba(37,99,235,0.1); transform: translateY(-2px); }

  .pa-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px 14px; border-bottom: 1px solid #f1f5f9;
    flex-wrap: wrap; gap: 10px;
  }
  .pa-card-body {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  .pa-col { padding: 22px 24px; }
  .pa-col:first-child { border-right: 1px solid #f1f5f9; }

  .pa-col-title {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
  }

  /* ── Skill tags ── */
  .skill-tag {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 600; margin: 3px;
  }
  .skill-req  { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
  .skill-free { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
  .skill-match { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  /* ── Status badge ── */
  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    font-size: 12px; font-weight: 700;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .s-pending  { background:#fffbeb; color:#d97706; border:1px solid #fde68a; }
  .s-pending .status-dot { background:#f59e0b; animation: pulse-dot 2s infinite; }
  .s-approved { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
  .s-approved .status-dot { background:#22c55e; }
  .s-rejected { background:#fef2f2; color:#ef4444; border:1px solid #fecaca; }
  .s-rejected .status-dot { background:#ef4444; }

  /* ── Action buttons ── */
  .btn-approve {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg,#16a34a,#15803d);
    color: white; font-weight: 700; font-size: 13px; cursor: pointer;
    box-shadow: 0 3px 10px rgba(22,163,74,0.3);
    transition: all 0.2s; font-family: 'Plus Jakarta Sans',sans-serif;
  }
  .btn-approve:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(22,163,74,0.4); }
  .btn-approve:disabled { opacity:0.55; cursor:not-allowed; }

  .btn-reject {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 20px; border-radius: 10px;
    border: 1.5px solid #fecaca; background: white;
    color: #ef4444; font-weight: 700; font-size: 13px; cursor: pointer;
    transition: all 0.2s; font-family: 'Plus Jakarta Sans',sans-serif;
  }
  .btn-reject:hover:not(:disabled) { background: #fef2f2; border-color: #ef4444; transform: translateY(-1px); }
  .btn-reject:disabled { opacity:0.55; cursor:not-allowed; }

  /* ── Freelancer info ── */
  .pa-freelancer {
    display: flex; align-items: center; gap: 10px;
    background: #f8fafc; border-radius: 12px;
    padding: 12px 14px; margin-bottom: 14px;
    border: 1px solid #f1f5f9;
  }
  .pa-avatar {
    width: 40px; height: 40px; border-radius: 11px;
    background: linear-gradient(135deg,#2563eb,#7c3aed);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 800; font-size: 16px; flex-shrink: 0;
  }

  /* ── Bid highlight ── */
  .pa-bid {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg,#f0fdf4,#dcfce7);
    border: 1px solid #bbf7d0; border-radius: 10px;
    padding: 6px 14px; font-size: 15px; font-weight: 800;
    color: #15803d; margin-top: 10px;
  }

  /* ── Proposal text ── */
  .pa-proposal {
    font-size: 14px; color: #475569; line-height: 1.65;
    margin: 0 0 10px;
    display: -webkit-box; -webkit-line-clamp: 4;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .pa-proposal.expanded { -webkit-line-clamp: unset; overflow: visible; }
  .pa-read-more {
    background: none; border: none; cursor: pointer;
    color: #2563eb; font-size: 12px; font-weight: 700;
    font-family: 'Plus Jakarta Sans',sans-serif;
    padding: 2px 0; transition: opacity 0.2s;
  }
  .pa-read-more:hover { opacity: 0.75; }

  /* ── Match score ── */
  .pa-match {
    display: inline-flex; align-items: center; gap: 5px;
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 4px 10px;
    font-size: 11px; font-weight: 700; color: #2563eb;
    margin-left: auto; flex-shrink: 0;
  }

  /* ── Empty ── */
  .pa-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 20px; text-align: center;
  }

  /* ── Skeleton ── */
  .skeleton {
    background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
    background-size: 600px 100%; animation: shimmer 1.5s infinite; border-radius: 10px;
  }

  /* ── Spinner ── */
  .pa-spinner {
    width:14px; height:14px;
    border:2px solid rgba(255,255,255,0.4);
    border-top-color:white; border-radius:50%;
    animation:spin 0.7s linear infinite;
  }
  .pa-spinner-red {
    width:14px; height:14px;
    border:2px solid #fca5a5;
    border-top-color:#ef4444; border-radius:50%;
    animation:spin 0.7s linear infinite;
  }

  @media (max-width: 700px) {
    .pa-card-body { grid-template-columns: 1fr; }
    .pa-col:first-child { border-right: none; border-bottom: 1px solid #f1f5f9; }
    .pa-stats { grid-template-columns: repeat(2,1fr); }
    .pa-navbar { padding: 0 16px; }
    .pa-main { padding: 24px 16px 60px; }
  }
`

const Icon = ({ d, size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
)
const icons = {
  check:   'M20 6 9 17l-5-5',
  x:       'M18 6 6 18M6 6l12 12',
  user:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  file:    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
  rupee:   'M6 3h12M6 8h12M9 3v18M9 8c3.33 0 6 .67 6 4s-3.33 4.33-6 4.33',
  back:    'M19 12H5M12 5l-7 7 7 7',
  inbox:   'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock:   'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2',
  mail:    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
}

// Helper: count matching skills
const matchScore = (required = [], freelancer = []) => {
  if (!required.length) return 0
  const lower = freelancer.map(s => s.toLowerCase())
  return required.filter(s => lower.includes(s.toLowerCase())).length
}

// Helper: format relative time
const relativeTime = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day:'numeric', month:'short' })
}

const ProjectApplications = () => {
  const navigate = useNavigate()

  const [applications,        setApplications]        = useState([])
  const [displayApplications, setDisplayApplications] = useState([])
  const [projectTitles,       setProjectTitles]       = useState([])
  const [activeFilter,        setActiveFilter]        = useState('All')
  const [statusFilter,        setStatusFilter]        = useState('All')
  const [loading,             setLoading]             = useState(true)
  const [actionLoading,       setActionLoading]       = useState(null)
  const [expandedProposals,   setExpandedProposals]   = useState({})
  const [sortBy,              setSortBy]              = useState('newest') // newest | bidLow | bidHigh | match

  const username = localStorage.getItem('username') || 'Client'

  /* ── Fetch ── */
  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/application')
      const clientApps = data.filter(app => app.clientId === localStorage.getItem('userId'))
      setApplications(clientApps)
      setProjectTitles([...new Set(clientApps.map(app => app.title))])
      applyFilters(clientApps, activeFilter, statusFilter, sortBy)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApplications() }, [])

  /* ── Filter + sort logic ── */
  const applyFilters = (apps, project, status, sort) => {
    let filtered = [...apps]
    if (project !== 'All')  filtered = filtered.filter(a => a.title === project)
    if (status  !== 'All')  filtered = filtered.filter(a => a.status === status)

    filtered.sort((a, b) => {
      if (sort === 'bidLow')  return Number(a.bidAmount) - Number(b.bidAmount)
      if (sort === 'bidHigh') return Number(b.bidAmount) - Number(a.bidAmount)
      if (sort === 'match') {
        return matchScore(b.requiredSkills, b.freelancerSkills) -
               matchScore(a.requiredSkills, a.freelancerSkills)
      }
      // newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })

    setDisplayApplications(filtered)
  }

  const handleFilter = (project) => {
    setActiveFilter(project)
    applyFilters(applications, project, statusFilter, sortBy)
  }
  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    applyFilters(applications, activeFilter, status, sortBy)
  }
  const handleSort = (sort) => {
    setSortBy(sort)
    applyFilters(applications, activeFilter, statusFilter, sort)
  }

  /* ── Actions ── */
  const handleApprove = async (id) => {
    setActionLoading(id + '-approve')
    try {
      await api.post(`/application/approve/${id}`)
      await fetchApplications()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id) => {
    setActionLoading(id + '-reject')
    try {
      await api.post(`/application/reject/${id}`)
      await fetchApplications()
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const toggleExpand = (id) => {
    setExpandedProposals(prev => ({ ...prev, [id]: !prev[id] }))
  }

  /* ── Stats ── */
  const pending  = applications.filter(a => a.status === 'Pending').length
  const approved = applications.filter(a => a.status === 'Approved').length
  const rejected = applications.filter(a => a.status === 'Rejected').length
  const total    = applications.length

  const statusCls = { Pending: 's-pending', Approved: 's-approved', Rejected: 's-rejected' }

  return (
    <div className="pa pa-page">
      <style>{S}</style>
      <div className="pa-blob1"/><div className="pa-blob2"/>

      {/* ── Navbar ── */}
      <nav className="pa-navbar">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span className="pa-nav-logo" onClick={() => navigate('/')}>SB Works</span>
          <span className="pa-nav-sep">›</span>
          <span className="pa-nav-link" onClick={() => navigate('/client')}>Client</span>
          <span className="pa-nav-sep">›</span>
          <span className="pa-nav-link pa-nav-active">Applications</span>
        </div>
        <div className="pa-nav-user">
          <div className="pa-nav-avatar">{username[0]?.toUpperCase()}</div>
          <span style={{ fontSize:13, fontWeight:600, color:'#334155' }}>{username}</span>
        </div>
      </nav>

      <div className="pa-main">

        {/* ── Header ── */}
        <div className="pa-header">
          <div>
            <button
              style={{ display:'inline-flex', alignItems:'center', gap:6,
                background:'none', border:'none', cursor:'pointer', fontSize:13,
                fontWeight:600, color:'#64748b', padding:'0 0 10px',
                fontFamily:'Plus Jakarta Sans,sans-serif', transition:'color 0.2s' }}
              onClick={() => navigate('/client')}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              <Icon d={icons.back} size={14} color="currentColor"/>
              Back to Projects
            </button>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#0f172a',
              letterSpacing:'-0.5px', margin:'0 0 4px' }}>
              Bids & Applications
            </h1>
            <p style={{ fontSize:14, color:'#64748b', margin:0 }}>
              See who has bid on your projects and manage proposals
            </p>
          </div>

          {/* Sort */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:12, fontWeight:600, color:'#94a3b8' }}>Sort by</span>
            <select
              value={sortBy}
              onChange={e => handleSort(e.target.value)}
              style={{ border:'1.5px solid #e2e8f0', borderRadius:10, padding:'7px 12px',
                fontSize:13, fontWeight:600, color:'#334155', background:'white',
                outline:'none', cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif' }}
            >
              <option value="newest">Newest First</option>
              <option value="bidLow">Bid: Low to High</option>
              <option value="bidHigh">Bid: High to Low</option>
              <option value="match">Best Skill Match</option>
            </select>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="pa-stats">
          {[
            { label:'Total Bids',     value:total,    color:'#2563eb', bg:'#eff6ff' },
            { label:'Pending Review', value:pending,  color:'#d97706', bg:'#fffbeb' },
            { label:'Approved',       value:approved, color:'#16a34a', bg:'#f0fdf4' },
            { label:'Rejected',       value:rejected, color:'#ef4444', bg:'#fef2f2' },
          ].map(({ label, value, color }, i) => (
            <div className="pa-stat" key={label} style={{ animationDelay:`${i*0.07}s` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#94a3b8' }}>{label}</div>
                <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
              </div>
              <div style={{ height:4, borderRadius:100, background:'#f1f5f9', marginTop:12, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:100, background:color,
                  width:`${total ? (value/total)*100 : 0}%`,
                  transition:'width 0.6s ease'
                }}/>
              </div>
            </div>
          ))}
        </div>

        {/* ── Status Filter Row ── */}
        <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              className={`pa-pill${statusFilter === s ? ' active' : ''}`}
              onClick={() => handleStatusFilter(s)}
            >
              {s}{s !== 'All' && ` (${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* ── Project Filter Pills ── */}
        {projectTitles.length > 0 && (
          <div className="pa-filters">
            <button className={`pa-pill${activeFilter === 'All' ? ' active' : ''}`}
              onClick={() => handleFilter('All')}>
              All Projects
            </button>
            {projectTitles.map(title => (
              <button
                key={title}
                className={`pa-pill${activeFilter === title ? ' active' : ''}`}
                onClick={() => handleFilter(title)}
                title={title}
              >
                {title.length > 26 ? title.slice(0, 26) + '…' : title}
                {' '}({applications.filter(a => a.title === title).length})
              </button>
            ))}
          </div>
        )}

        {/* ── Cards ── */}
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} style={{ background:'white', borderRadius:22, padding:24,
              border:'1px solid #e2e8f0', marginBottom:16 }}>
              <div className="skeleton" style={{ height:20, width:'40%', marginBottom:14 }}/>
              <div className="skeleton" style={{ height:14, width:'70%', marginBottom:8 }}/>
              <div className="skeleton" style={{ height:14, width:'55%', marginBottom:8 }}/>
              <div className="skeleton" style={{ height:14, width:'30%' }}/>
            </div>
          ))
        ) : displayApplications.length === 0 ? (
          <div className="pa-empty">
            <div style={{ width:80, height:80, borderRadius:24,
              background:'linear-gradient(135deg,#eff6ff,#dbeafe)',
              display:'flex', alignItems:'center', justifyContent:'center',
              marginBottom:20, fontSize:36 }}>📬</div>
            <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>
              No applications yet
            </h3>
            <p style={{ fontSize:14, color:'#94a3b8', margin:0 }}>
              {activeFilter === 'All' && statusFilter === 'All'
                ? 'Freelancers will bid on your projects here.'
                : `No ${statusFilter !== 'All' ? statusFilter.toLowerCase() + ' ' : ''}applications${activeFilter !== 'All' ? ` for "${activeFilter}"` : ''}.`}
            </p>
          </div>
        ) : (
          displayApplications.map((app, i) => {
            const matched = matchScore(app.requiredSkills, app.freelancerSkills)
            const total_req = app.requiredSkills?.length || 0
            const matchPct = total_req ? Math.round((matched / total_req) * 100) : null
            const isExpanded = expandedProposals[app._id]

            return (
              <div className="pa-card" key={app._id} style={{ animationDelay:`${i*0.05}s` }}>

                {/* Card header */}
                <div className="pa-card-header">
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:16, fontWeight:700, color:'#0f172a',
                      marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {app.title}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                      <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>
                        Bid by <strong style={{ color:'#475569' }}>{app.freelancerName || 'Freelancer'}</strong>
                      </span>
                      {app.createdAt && (
                        <span style={{ fontSize:11, color:'#cbd5e1',
                          display:'flex', alignItems:'center', gap:3 }}>
                          <Icon d={icons.clock} size={11} color="#cbd5e1"/>
                          {relativeTime(app.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {matchPct !== null && (
                      <span className="pa-match">
                        <Icon d={icons.star} size={11} color="#2563eb"/>
                        {matchPct}% match
                      </span>
                    )}
                    <span className={`status-badge ${statusCls[app.status] || 's-pending'}`}>
                      <span className="status-dot"/>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="pa-card-body">

                  {/* Left — project details */}
                  <div className="pa-col">
                    <div className="pa-col-title">
                      <Icon d={icons.file} size={12} color="#94a3b8"/>
                      Project Details
                    </div>

                    <p style={{ fontSize:14, color:'#475569', lineHeight:1.65,
                      margin:'0 0 14px',
                      display:'-webkit-box', WebkitLineClamp:3,
                      WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {app.description}
                    </p>

                    <div style={{ display:'flex', alignItems:'center', gap:8,
                      background:'#f0fdf4', border:'1px solid #bbf7d0',
                      borderRadius:10, padding:'8px 12px', width:'fit-content', marginBottom:12 }}>
                      <Icon d={icons.rupee} size={13} color="#16a34a"/>
                      <span style={{ fontSize:14, fontWeight:800, color:'#15803d' }}>
                        ₹{Number(app.budget).toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize:12, color:'#64748b', fontWeight:500 }}>project budget</span>
                    </div>

                    {app.requiredSkills?.length > 0 && (
                      <>
                        <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8',
                          textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>
                          Required Skills
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:0 }}>
                          {app.requiredSkills.map(s => {
                            const isMatch = app.freelancerSkills
                              ?.map(fs => fs.toLowerCase())
                              .includes(s.toLowerCase())
                            return (
                              <span key={s} className={`skill-tag ${isMatch ? 'skill-match' : 'skill-req'}`}>
                                {isMatch ? '✓ ' : ''}{s}
                              </span>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right — freelancer proposal */}
                  <div className="pa-col">
                    <div className="pa-col-title">
                      <Icon d={icons.user} size={12} color="#94a3b8"/>
                      Bidder's Proposal
                    </div>

                    {/* Freelancer info */}
                    <div className="pa-freelancer">
                      <div className="pa-avatar">
                        {(app.freelancerName || 'F')[0].toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>
                          {app.freelancerName || 'Freelancer'}
                        </div>
                        {app.freelancerEmail && (
                          <div style={{ fontSize:12, color:'#94a3b8', fontWeight:500,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                            display:'flex', alignItems:'center', gap:4 }}>
                            <Icon d={icons.mail} size={11} color="#94a3b8"/>
                            {app.freelancerEmail}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposal text */}
                    {app.proposal ? (
                      <>
                        <p className={`pa-proposal${isExpanded ? ' expanded' : ''}`}>
                          {app.proposal}
                        </p>
                        {app.proposal.length > 180 && (
                          <button className="pa-read-more" onClick={() => toggleExpand(app._id)}>
                            {isExpanded ? '↑ Show less' : '↓ Read full proposal'}
                          </button>
                        )}
                      </>
                    ) : (
                      <p style={{ fontSize:13, color:'#cbd5e1', fontStyle:'italic', marginBottom:10 }}>
                        No proposal text provided.
                      </p>
                    )}

                    {/* Freelancer skills */}
                    {app.freelancerSkills?.length > 0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:0, marginBottom:6, marginTop:8 }}>
                        {app.freelancerSkills.map(s => (
                          <span key={s} className="skill-tag skill-free">{s}</span>
                        ))}
                      </div>
                    )}

                    {/* Bid amount */}
                    <div className="pa-bid">
                      <Icon d={icons.rupee} size={14} color="#15803d"/>
                      ₹{Number(app.bidAmount).toLocaleString('en-IN')} proposed
                    </div>

                    {/* Budget comparison note */}
                    {app.budget && app.bidAmount && (
                      <div style={{ fontSize:12, color:'#94a3b8', marginTop:6, fontWeight:500 }}>
                        {Number(app.bidAmount) <= Number(app.budget)
                          ? `✓ Within your budget (₹${Number(app.budget).toLocaleString('en-IN')})`
                          : `⚠ Exceeds your budget by ₹${(Number(app.bidAmount) - Number(app.budget)).toLocaleString('en-IN')}`
                        }
                      </div>
                    )}

                    {/* Action buttons (only for pending) */}
                    {app.status === 'Pending' && (
                      <div style={{ display:'flex', gap:10, marginTop:16 }}>
                        <button
                          className="btn-approve"
                          disabled={!!actionLoading}
                          onClick={() => handleApprove(app._id)}
                        >
                          {actionLoading === app._id + '-approve'
                            ? <div className="pa-spinner"/>
                            : <Icon d={icons.check} size={13} color="white"/>
                          }
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          disabled={!!actionLoading}
                          onClick={() => handleReject(app._id)}
                        >
                          {actionLoading === app._id + '-reject'
                            ? <div className="pa-spinner-red"/>
                            : <Icon d={icons.x} size={13} color="#ef4444"/>
                          }
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Already approved/rejected note */}
                    {app.status === 'Approved' && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14,
                        background:'#f0fdf4', border:'1px solid #bbf7d0',
                        borderRadius:10, padding:'10px 14px' }}>
                        <Icon d={icons.check} size={14} color="#16a34a"/>
                        <span style={{ fontSize:13, fontWeight:700, color:'#16a34a' }}>
                          Application Approved
                        </span>
                      </div>
                    )}
                    {app.status === 'Rejected' && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14,
                        background:'#fef2f2', border:'1px solid #fecaca',
                        borderRadius:10, padding:'10px 14px' }}>
                        <Icon d={icons.x} size={14} color="#ef4444"/>
                        <span style={{ fontSize:13, fontWeight:700, color:'#ef4444' }}>
                          Application Rejected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Result count */}
        {!loading && displayApplications.length > 0 && (
          <div style={{ textAlign:'center', fontSize:12, color:'#cbd5e1',
            fontWeight:600, marginTop:8 }}>
            Showing {displayApplications.length} of {applications.length} applications
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectApplications