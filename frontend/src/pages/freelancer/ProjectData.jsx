import { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { GeneralContext } from '../../context/GeneralContext'

/* ── Icons ─────────────────────────────────────────────── */
const IconGrid      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconFolder    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const IconFile      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const IconUser      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconClipboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
const IconLogout    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconSend      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IconLink      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const IconRupee     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="12" y1="8" x2="6" y2="21"/><path d="M6 3h6a6 6 0 0 1 0 5"/></svg>
const IconClock     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconCheck     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IconChat      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const IconUpload    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .pd * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pd-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #f0f4ff 0%, #f8fafc 60%, #f0fdf4 100%);
  }

  /* Navbar */
  .pd-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pd-nav-link {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    border: none; background: none; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .pd-nav-link:hover { background: #f1f5f9; color: #0f172a; }

  /* Cards */
  .pd-card {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    overflow: hidden; animation: fadeUp 0.4s ease both;
  }
  .pd-card-header {
    padding: 18px 24px; border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; gap: 10;
  }
  .pd-card-body { padding: 24px; }

  /* Input */
  .pd-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-size: 14px; color: #0f172a; outline: none;
    background: #f8fafc; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .pd-input:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
  .pd-input::placeholder { color: #cbd5e1; }
  .pd-label { display: block; font-size: 12px; font-weight: 700; color: #374155; margin-bottom: 6px; }

  /* Buttons */
  .pd-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg,#2563eb,#1d4ed8);
    color: white; font-weight: 700; font-size: 14px;
    padding: 11px 24px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: all 0.22s; font-family: 'Plus Jakarta Sans',sans-serif;
  }
  .pd-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.42); }
  .pd-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .pd-btn-green {
    display: inline-flex; align-items: center; gap: 7px;
    background: linear-gradient(135deg,#16a34a,#15803d);
    color: white; font-weight: 700; font-size: 14px;
    padding: 11px 24px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(22,163,74,0.35);
    transition: all 0.22s; font-family: 'Plus Jakarta Sans',sans-serif;
  }
  .pd-btn-green:hover:not(:disabled) { transform: translateY(-2px); }
  .pd-btn-green:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Chat bubbles */
  .pd-bubble-mine {
    max-width: 70%; background: linear-gradient(135deg,#2563eb,#1d4ed8);
    color: white; border-radius: 16px 16px 4px 16px;
    padding: 10px 14px; font-size: 13px; line-height: 1.5;
    margin-left: auto; animation: msgIn 0.2s ease;
    box-shadow: 0 2px 10px rgba(37,99,235,0.25);
  }
  .pd-bubble-other {
    max-width: 70%; background: white; color: #0f172a;
    border-radius: 16px 16px 16px 4px;
    padding: 10px 14px; font-size: 13px; line-height: 1.5;
    border: 1px solid #e2e8f0; animation: msgIn 0.2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  /* Skill pill */
  .pd-skill {
    display: inline-flex; align-items: center;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe; border-radius: 100px;
    padding: 3px 10px; font-size: 11.5px; font-weight: 600;
  }

  /* Section icon circle */
  .pd-icon-circle {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
`

const ProjectData = () => {
  const { id }          = useParams()
  const navigate        = useNavigate()
  const { socket }      = useContext(GeneralContext)
  const chatEndRef      = useRef(null)

  const userId   = localStorage.getItem('userId')
  const username = localStorage.getItem('username') || 'You'

  const [project,               setProject]               = useState(null)
  const [chats,                 setChats]                 = useState([])
  const [message,               setMessage]               = useState('')
  const [proposal,              setProposal]              = useState('')
  const [bidAmount,             setBidAmount]             = useState('')
  const [estimatedTime,         setEstimatedTime]         = useState('')
  const [projectLink,           setProjectLink]           = useState('')
  const [manualLink,            setManualLink]            = useState('')
  const [submissionDescription, setSubmissionDescription] = useState('')
  const [bidding,               setBidding]               = useState(false)
  const [submitting,            setSubmitting]            = useState(false)

  const fetchProject = async () => {
    try { const { data } = await api.get(`/project/${id}`); setProject(data) }
    catch (err) { console.error(err) }
  }
  const fetchChats = async () => {
    try { const { data } = await api.get(`/chat/${userId}`); setChats(data || []) }
    catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (!id || !userId) return
    Promise.all([fetchProject(), fetchChats()])
  }, [id, userId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats])

  useEffect(() => {
    if (!socket || !userId) return
    socket.emit('join-chat-room', { projectId: id, userId })
    const onMessage = () => fetchChats()
    socket.on('message-from-user', onMessage)
    return () => socket.off('message-from-user', onMessage)
  }, [socket, id, userId])

  const handleBid = async () => {
    setBidding(true)
    try {
      await api.post('/application/bid', {
        clientId: project.clientId, freelancerId: userId,
        projectId: id, proposal, bidAmount, estimatedTime
      })
      setProposal(''); setBidAmount(''); setEstimatedTime('')
      fetchProject()
    } catch (err) { console.error(err) }
    finally { setBidding(false) }
  }

  const handleSubmission = async () => {
    setSubmitting(true)
    try {
      await api.post('/project/submit', {
        projectId: id, projectLink, manualLink, submissionDescription
      })
      setProjectLink(''); setManualLink(''); setSubmissionDescription('')
      fetchProject()
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const handleMessageSend = () => {
    if (!message.trim() || !socket) return
    socket.emit('new-message', { projectId: id, senderId: userId, text: message, time: new Date() })
    setMessage('')
  }

  const logout = () => { localStorage.clear(); navigate('/') }

  if (!project) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const canChat    = project.freelancerId === userId || project.clientId === userId
  const alreadyBid = project.bids?.includes(userId)
  const messages   = chats?.[0]?.messages || []

  const navLinks = [
    { key: 'dashboard',    label: 'Dashboard',    icon: <IconGrid />,      path: '/freelancer' },
    { key: 'projects',     label: 'All Projects', icon: <IconFolder />,    path: '/freelancer/all-projects' },
    { key: 'myprojects',   label: 'My Projects',  icon: <IconFile />,      path: '/freelancer/my-projects' },
    { key: 'applications', label: 'Applications', icon: <IconClipboard />, path: '/freelancer/myApplications' },
    { key: 'profile',      label: 'Profile',      icon: <IconUser />,      path: '/freelancer' },
  ]

  return (
    <div className="pd pd-page">
      <style>{S}</style>

      {/* ── NAVBAR ── */}
      <nav className="pd-nav">
        <span onClick={() => navigate('/')}
          style={{ fontSize: 20, fontWeight: 800, color: '#2563eb', cursor: 'pointer', letterSpacing: '-0.5px' }}>
          SB Works
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(({ key, label, icon, path }) => (
            <button key={key} className="pd-nav-link" onClick={() => navigate(path)}>
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
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Back button */}
        <button onClick={() => navigate('/freelancer/all-projects')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b',
            padding: 0, transition: 'color 0.2s', width: 'fit-content' }}
          onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
          <IconArrowLeft /> Back to Projects
        </button>

        {/* ── PROJECT INFO ── */}
        <div className="pd-card" style={{ animationDelay: '0s' }}>
          {/* Header gradient */}
          <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#4338ca)', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white',
                  letterSpacing: '-0.5px', marginBottom: 8 }}>{project.title}</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
                  {project.description}
                </p>
              </div>
              {/* Status badge */}
              <div style={{ flexShrink: 0, marginLeft: 20,
                background: project.status === 'Available' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.15)',
                border: `1px solid ${project.status === 'Available' ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.2)'}`,
                color: project.status === 'Available' ? '#86efac' : 'rgba(255,255,255,0.8)',
                padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                ● {project.status}
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 28px', display: 'flex', gap: 32, flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700, color: '#16a34a' }}>
              <IconRupee /> ₹{project.budget?.toLocaleString('en-IN') || 0}
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>budget</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
              <IconClock /> {project.bids?.length || 0} bids placed
            </div>
          </div>

          {(project.skills || []).length > 0 && (
            <div style={{ padding: '16px 28px', display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {(project.skills || []).map(s => <span key={s} className="pd-skill">{s}</span>)}
            </div>
          )}
        </div>

        {/* ── BID FORM ── */}
        {project.status === 'Available' && (
          <div className="pd-card" style={{ animationDelay: '0.08s' }}>
            <div className="pd-card-header" style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="pd-icon-circle" style={{ background: '#f0fdf4', color: '#16a34a' }}><IconSend /></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Send Proposal</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Submit your bid for this project</div>
              </div>
            </div>
            <div className="pd-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="pd-label">Bid Amount (₹)</label>
                  <input type="number" placeholder="e.g. 15000" value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)} className="pd-input" />
                </div>
                <div>
                  <label className="pd-label">Estimated Days</label>
                  <input type="number" placeholder="e.g. 7" value={estimatedTime}
                    onChange={e => setEstimatedTime(e.target.value)} className="pd-input" />
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="pd-label">Your Proposal</label>
                <textarea placeholder="Describe your approach, relevant experience, and why you're the best fit..."
                  value={proposal} onChange={e => setProposal(e.target.value)}
                  className="pd-input" rows={4} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <button className={alreadyBid ? undefined : 'pd-btn-green'}
                onClick={!alreadyBid ? handleBid : undefined}
                disabled={alreadyBid || bidding}
                style={alreadyBid ? { display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#f1f5f9', color: '#94a3b8', fontWeight: 700, fontSize: 14,
                  padding: '11px 24px', borderRadius: 12, border: '1px solid #e2e8f0', cursor: 'not-allowed' } : {}}>
                {alreadyBid ? <><IconCheck /> Already Bidded</> : bidding ? 'Placing bid…' : <><IconSend /> Post Bid</>}
              </button>
            </div>
          </div>
        )}

        {/* ── SUBMISSION ── */}
        {project.freelancerId === userId && (
          <div className="pd-card" style={{ animationDelay: '0.12s' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="pd-icon-circle" style={{ background: '#eff6ff', color: '#2563eb' }}><IconUpload /></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Submit Project</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Deliver your completed work</div>
              </div>
            </div>
            <div className="pd-card-body">
              {project.submissionAccepted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                  background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16a34a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <IconCheck />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#15803d' }}>Project Completed!</div>
                    <div style={{ fontSize: 12, color: '#16a34a' }}>Your submission was accepted by the client</div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label className="pd-label"><IconLink /> Project Link</label>
                      <input type="text" placeholder="https://github.com/..." value={projectLink}
                        onChange={e => setProjectLink(e.target.value)} className="pd-input" />
                    </div>
                    <div>
                      <label className="pd-label"><IconLink /> Manual / Demo Link</label>
                      <input type="text" placeholder="https://..." value={manualLink}
                        onChange={e => setManualLink(e.target.value)} className="pd-input" />
                    </div>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label className="pd-label">Work Description</label>
                    <textarea placeholder="Describe what you built, how to use it, and any important notes..."
                      value={submissionDescription} onChange={e => setSubmissionDescription(e.target.value)}
                      className="pd-input" rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
                  </div>
                  <button className="pd-btn-primary"
                    onClick={!project.submission ? handleSubmission : undefined}
                    disabled={!!project.submission || submitting}>
                    {project.submission
                      ? <><IconCheck /> Already Submitted</>
                      : submitting ? 'Submitting…' : <><IconUpload /> Submit Project</>
                    }
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        <div className="pd-card" style={{ animationDelay: '0.16s' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="pd-icon-circle" style={{ background: '#fdf4ff', color: '#7c3aed' }}><IconChat /></div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Project Chat</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                {canChat ? 'Real-time communication with the client' : 'Available after project assignment'}
              </div>
            </div>
            {canChat && messages.length > 0 && (
              <div style={{ marginLeft: 'auto', background: '#eff6ff', color: '#2563eb',
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                border: '1px solid #bfdbfe' }}>
                {messages.length} messages
              </div>
            )}
          </div>

          <div className="pd-card-body">
            {canChat ? (
              <>
                {/* Messages */}
                <div style={{ height: 280, overflowY: 'auto', display: 'flex',
                  flexDirection: 'column', gap: 10, marginBottom: 16,
                  padding: '4px 0', scrollbarWidth: 'thin' }}>
                  {messages.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>No messages yet</div>
                      <div style={{ fontSize: 12 }}>Start the conversation!</div>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} style={{ display: 'flex',
                        justifyContent: msg.senderId === userId ? 'flex-end' : 'flex-start' }}>
                        <div className={msg.senderId === userId ? 'pd-bubble-mine' : 'pd-bubble-other'}>
                          {msg.text || msg.message}
                          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4,
                            textAlign: msg.senderId === userId ? 'right' : 'left' }}>
                            {msg.time ? new Date(msg.time).toLocaleTimeString('en-IN', {
                              hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={message} onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleMessageSend()}
                    className="pd-input" placeholder="Type a message… (Enter to send)"
                    style={{ flex: 1 }} />
                  <button onClick={handleMessageSend}
                    style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', border: 'none',
                      cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
                      transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <IconSend />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>Chat locked</div>
                <div style={{ fontSize: 13 }}>Chat will be enabled once the project is assigned to you</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectData