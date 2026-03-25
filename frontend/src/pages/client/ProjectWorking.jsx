import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { GeneralContext } from '../../context/GeneralContext'

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .pw * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes blobFloat1 {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(22px,-14px) scale(1.04); }
  }
  @keyframes blobFloat2 {
    0%,100% { transform:translate(0,0) scale(1); }
    50%      { transform:translate(-14px,18px) scale(1.03); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes msgPop {
    from { opacity:0; transform:translateY(8px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(0.95); box-shadow:0 0 0 0 rgba(37,99,235,0.4); }
    70%  { transform:scale(1);    box-shadow:0 0 0 8px rgba(37,99,235,0); }
    100% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(37,99,235,0); }
  }

  .pw-page {
    min-height:100vh;
    background:linear-gradient(145deg,#eef2ff 0%,#f0f9ff 50%,#faf5ff 100%);
    position:relative; overflow-x:hidden;
  }
  .pw-blob1 {
    position:fixed; width:560px; height:560px; border-radius:50%;
    background:radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%);
    top:-170px; left:-130px; pointer-events:none;
    animation:blobFloat1 12s ease-in-out infinite;
  }
  .pw-blob2 {
    position:fixed; width:440px; height:440px; border-radius:50%;
    background:radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%);
    bottom:-120px; right:-100px; pointer-events:none;
    animation:blobFloat2 14s ease-in-out infinite;
  }

  /* Navbar */
  .pw-navbar {
    position:sticky; top:0; z-index:100;
    background:rgba(255,255,255,0.88);
    backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
    border-bottom:1px solid rgba(0,0,0,0.06);
    box-shadow:0 2px 24px rgba(0,0,0,0.06);
    display:flex; justify-content:space-between; align-items:center;
    padding:0 32px; height:64px;
  }

  /* Layout */
  .pw-layout {
    display:grid; grid-template-columns:1fr 380px;
    gap:24px; max-width:1200px; margin:0 auto;
    padding:32px 24px 80px; position:relative; z-index:1;
  }

  /* Section card */
  .pw-card {
    background:white; border-radius:22px;
    border:1px solid rgba(226,232,240,0.9);
    box-shadow:0 2px 14px rgba(0,0,0,0.05);
    overflow:hidden; animation:fadeUp 0.45s ease both;
    margin-bottom:20px;
  }
  .pw-card-head {
    display:flex; align-items:center; gap:10px;
    padding:18px 24px; border-bottom:1px solid #f1f5f9;
  }
  .pw-card-head-icon {
    width:34px; height:34px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:16px; flex-shrink:0;
  }
  .pw-card-body { padding:24px; }

  /* Skill tags */
  .pw-skill {
    display:inline-flex; align-items:center;
    background:#f1f5f9; color:#475569;
    border:1px solid #e2e8f0;
    padding:3px 10px; border-radius:100px;
    font-size:11px; font-weight:600; margin:3px;
  }

  /* Status badge */
  .pw-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 14px; border-radius:100px;
    font-size:12px; font-weight:700;
  }
  .pw-badge-dot { width:6px; height:6px; border-radius:50%; }
  .b-assigned  { background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; }
  .b-assigned .pw-badge-dot { background:#3b82f6; animation:pulse-ring 2s infinite; }
  .b-completed { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
  .b-completed .pw-badge-dot { background:#22c55e; }

  /* Submission */
  .pw-submission-link {
    display:inline-flex; align-items:center; gap:7px;
    background:linear-gradient(135deg,#eff6ff,#dbeafe);
    border:1px solid #bfdbfe; border-radius:10px;
    padding:9px 16px; color:#2563eb; font-weight:700;
    font-size:13px; text-decoration:none; transition:all 0.2s;
  }
  .pw-submission-link:hover { background:linear-gradient(135deg,#dbeafe,#bfdbfe); }

  .btn-approve {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 22px; border-radius:11px; border:none;
    background:linear-gradient(135deg,#16a34a,#15803d);
    color:white; font-weight:700; font-size:13px; cursor:pointer;
    box-shadow:0 3px 12px rgba(22,163,74,0.3);
    transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .btn-approve:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(22,163,74,0.4); }
  .btn-approve:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

  .btn-reject {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 22px; border-radius:11px;
    border:1.5px solid #fecaca; background:white;
    color:#ef4444; font-weight:700; font-size:13px; cursor:pointer;
    transition:all 0.2s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .btn-reject:hover { background:#fef2f2; border-color:#ef4444; transform:translateY(-1px); }
  .btn-reject:disabled { opacity:0.55; cursor:not-allowed; }

  /* ── CHAT ── */
  .pw-chat-wrap {
    position:sticky; top:88px;
  }
  .pw-chat-messages {
    height:340px; overflow-y:auto; padding:16px;
    display:flex; flex-direction:column; gap:10px;
    scroll-behavior:smooth;
  }
  .pw-chat-messages::-webkit-scrollbar { width:4px; }
  .pw-chat-messages::-webkit-scrollbar-track { background:transparent; }
  .pw-chat-messages::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:10px; }

  .pw-msg {
    max-width:75%; padding:10px 14px; border-radius:16px;
    font-size:13px; line-height:1.55; animation:msgPop 0.2s ease both;
    word-break:break-word;
  }
  .pw-msg-me {
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    color:white; border-radius:16px 16px 4px 16px;
    align-self:flex-end;
    box-shadow:0 3px 10px rgba(37,99,235,0.25);
  }
  .pw-msg-them {
    background:#f1f5f9; color:#0f172a;
    border-radius:16px 16px 16px 4px;
    align-self:flex-start; border:1px solid #e2e8f0;
  }
  .pw-msg-time {
    font-size:10px; margin-top:3px; opacity:0.65;
  }

  .pw-chat-input-wrap {
    display:flex; gap:10px; padding:16px;
    border-top:1px solid #f1f5f9; align-items:flex-end;
  }
  .pw-chat-input {
    flex:1; border:1.5px solid #e2e8f0; border-radius:14px;
    padding:11px 14px; font-size:14px; color:#0f172a; outline:none;
    background:#f8fafc; transition:all 0.2s; resize:none;
    font-family:'Plus Jakarta Sans',sans-serif; line-height:1.5;
    max-height:100px; overflow-y:auto;
  }
  .pw-chat-input:focus {
    border-color:#2563eb; background:white;
    box-shadow:0 0 0 4px rgba(37,99,235,0.08);
  }
  .pw-chat-input::placeholder { color:#cbd5e1; }
  .pw-send-btn {
    width:42px; height:42px; border-radius:12px; border:none;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    color:white; cursor:pointer; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 3px 10px rgba(37,99,235,0.3);
    transition:all 0.2s;
  }
  .pw-send-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(37,99,235,0.4); }
  .pw-send-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

  /* Freelancer info card */
  .pw-freelancer {
    display:flex; align-items:center; gap:12px;
    background:#f8fafc; border-radius:14px; padding:14px 16px;
    border:1px solid #f1f5f9; margin-bottom:4px;
  }
  .pw-f-avatar {
    width:42px; height:42px; border-radius:12px;
    background:linear-gradient(135deg,#2563eb,#7c3aed);
    display:flex; align-items:center; justify-content:center;
    color:white; font-weight:800; font-size:18px; flex-shrink:0;
  }

  /* Spinner */
  .pw-spinner {
    width:16px; height:16px; border:2.5px solid rgba(255,255,255,0.35);
    border-top-color:white; border-radius:50%;
    animation:spin 0.7s linear infinite;
  }

  @media (max-width:900px) {
    .pw-layout { grid-template-columns:1fr; }
    .pw-chat-wrap { position:static; }
  }
`

const Icon = ({ d, size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
)
const icons = {
  back:    'M19 12H5M12 5l-7 7 7 7',
  check:   'M20 6 9 17l-5-5',
  x:       'M18 6 6 18M6 6l12 12',
  link:    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
  send:    'M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z',
  chat:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  upload:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  user:    'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  info:    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01',
  rupee:   'M6 3h12M6 8h12M9 3v18M9 8c3.33 0 6 .67 6 4s-3.33 4.33-6 4.33',
}

const ProjectWorking = () => {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { socket } = useContext(GeneralContext)

  const [project,       setProject]       = useState(null)
  const [chats,         setChats]         = useState(null)
  const [message,       setMessage]       = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const chatEndRef = useRef(null)
  const userId     = localStorage.getItem('userId')
  const username   = localStorage.getItem('username') || 'Client'

  const fetchProject = async () => {
    try { const { data } = await api.get(`/project/${id}`); setProject(data) }
    catch (err) { console.error(err) }
  }
  const fetchChats = async () => {
    try { const { data } = await api.get(`/chat/${id}`); setChats(data) }
    catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (!id) return
    Promise.all([fetchProject(), fetchChats()])
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats])

  useEffect(() => {
    if (!socket) return
    const onMessage = () => fetchChats()
    socket.on('message-from-user', onMessage)
    return () => socket.off('message-from-user', onMessage)
  }, [socket, id])

  const handleApprove = async () => {
    setActionLoading('approve')
    try { await api.post(`/application/approve/${id}`); fetchProject() }
    catch {} finally { setActionLoading(null) }
  }
  const handleReject = async () => {
    setActionLoading('reject')
    try { await api.post(`/application/reject/${id}`); fetchProject() }
    catch {} finally { setActionLoading(null) }
  }

  const handleSend = () => {
    if (!message.trim() || !socket) return
    socket.emit('new-message', {
      projectId: id, senderId: userId,
      message: message.trim(), time: new Date()
    })
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const fmtTime = (t) => {
    if (!t) return ''
    const d = new Date(t)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!project) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'linear-gradient(145deg,#eef2ff,#f0f9ff)' }}>
      <div style={{ width:36, height:36, border:'3px solid #dbeafe',
        borderTopColor:'#2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`.pw * { box-sizing:border-box; } @keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )

  const isCompleted = project.status === 'Completed' || project.submissionAccepted
  const statusCls   = isCompleted ? 'b-completed' : 'b-assigned'
  const statusLabel = isCompleted ? 'Completed' : 'In Progress'

  return (
    <div className="pw pw-page">
      <style>{S}</style>
      <div className="pw-blob1"/><div className="pw-blob2"/>

      {/* Navbar */}
      <nav className="pw-navbar">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span onClick={() => navigate('/')}
            style={{ fontSize:20, fontWeight:800, color:'#2563eb', cursor:'pointer', letterSpacing:'-0.5px' }}>
            SB Works
          </span>
          <span style={{ color:'#e2e8f0', fontSize:18 }}>›</span>
          <span onClick={() => navigate('/client')}
            style={{ fontSize:14, fontWeight:600, color:'#64748b', cursor:'pointer' }}>Client</span>
          <span style={{ color:'#e2e8f0', fontSize:18 }}>›</span>
          <span style={{ fontSize:14, fontWeight:600, color:'#2563eb',
            maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {project.title}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8,
          background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'7px 14px' }}>
          <div style={{ width:28, height:28, borderRadius:8,
            background:'linear-gradient(135deg,#2563eb,#7c3aed)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'white', fontWeight:800, fontSize:12 }}>
            {username[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:'#334155' }}>{username}</span>
        </div>
      </nav>

      <div className="pw-layout">

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Back */}
          <button style={{ display:'inline-flex', alignItems:'center', gap:6,
            background:'none', border:'none', cursor:'pointer', fontSize:13,
            fontWeight:600, color:'#64748b', padding:'0 0 18px',
            fontFamily:'Plus Jakarta Sans,sans-serif', transition:'color 0.2s' }}
            onClick={() => navigate('/client')}
            onMouseEnter={e=>e.currentTarget.style.color='#2563eb'}
            onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>
            <Icon d={icons.back} size={14} color="currentColor"/>
            Back to Projects
          </button>

          {/* Project Info */}
          <div className="pw-card" style={{ animationDelay:'0s' }}>
            <div className="pw-card-head">
              <div className="pw-card-head-icon" style={{ background:'#eff6ff' }}>📋</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8',
                  letterSpacing:'0.1em', textTransform:'uppercase' }}>Project</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>
                  {project.title}
                </div>
              </div>
              <span className={`pw-badge ${statusCls}`}>
                <span className="pw-badge-dot"/>
                {statusLabel}
              </span>
            </div>
            <div className="pw-card-body">
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, margin:'0 0 16px' }}>
                {project.description}
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:0, marginBottom:16 }}>
                {project.skills?.map(s => <span key={s} className="pw-skill">{s}</span>)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8,
                background:'#f0fdf4', border:'1px solid #bbf7d0',
                borderRadius:10, padding:'9px 14px', width:'fit-content' }}>
                <Icon d={icons.rupee} size={14} color="#16a34a"/>
                <span style={{ fontSize:15, fontWeight:800, color:'#15803d' }}>
                  ₹{Number(project.budget).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize:12, color:'#64748b', fontWeight:500 }}>budget</span>
              </div>
            </div>
          </div>

          {/* Freelancer info */}
          {project.freelancerId && (
            <div className="pw-card" style={{ animationDelay:'0.07s' }}>
              <div className="pw-card-head">
                <div className="pw-card-head-icon" style={{ background:'#f0fdf4' }}>👤</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8',
                    letterSpacing:'0.1em', textTransform:'uppercase' }}>Assigned Freelancer</div>
                </div>
              </div>
              <div className="pw-card-body">
                <div className="pw-freelancer">
                  <div className="pw-f-avatar">
                    {(project.freelancerName || 'F')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:'#0f172a' }}>
                      {project.freelancerName || 'Freelancer'}
                    </div>
                    <div style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>
                      {project.freelancerEmail || 'Working on your project'}
                    </div>
                  </div>
                  <div style={{ marginLeft:'auto' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5,
                      background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0',
                      padding:'4px 10px', borderRadius:100, fontSize:11, fontWeight:700 }}>
                      ● Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submission */}
          {project.freelancerId && (
            <div className="pw-card" style={{ animationDelay:'0.14s' }}>
              <div className="pw-card-head">
                <div className="pw-card-head-icon" style={{ background:'#fdf4ff' }}>📦</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8',
                    letterSpacing:'0.1em', textTransform:'uppercase' }}>Submission</div>
                </div>
              </div>
              <div className="pw-card-body">
                {project.submission ? (
                  <>
                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer"
                      className="pw-submission-link" style={{ marginBottom:16, display:'inline-flex' }}>
                      <Icon d={icons.link} size={14} color="#2563eb"/>
                      View Submitted Project
                    </a>
                    {project.submissionDescription && (
                      <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7,
                        margin:'12px 0 16px', background:'#f8fafc',
                        borderRadius:12, padding:'12px 14px', border:'1px solid #f1f5f9' }}>
                        {project.submissionDescription}
                      </p>
                    )}
                    {project.submissionAccepted ? (
                      <div style={{ display:'flex', alignItems:'center', gap:10,
                        background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',
                        border:'1px solid #bbf7d0', borderRadius:12, padding:'14px 18px' }}>
                        <div style={{ width:32, height:32, borderRadius:10,
                          background:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Icon d={icons.check} size={16} color="white"/>
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:800, color:'#15803d' }}>
                            Project Completed! 🎉
                          </div>
                          <div style={{ fontSize:12, color:'#64748b' }}>
                            Submission approved and payment released
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display:'flex', gap:10, marginTop:4 }}>
                        <button className="btn-approve" disabled={!!actionLoading} onClick={handleApprove}>
                          {actionLoading === 'approve'
                            ? <div className="pw-spinner"/>
                            : <Icon d={icons.check} size={13} color="white"/>}
                          Approve Work
                        </button>
                        <button className="btn-reject" disabled={!!actionLoading} onClick={handleReject}>
                          {actionLoading === 'reject'
                            ? <div style={{ width:14, height:14, border:'2px solid #fca5a5',
                                borderTopColor:'#ef4444', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
                            : <Icon d={icons.x} size={13} color="#ef4444"/>}
                          Request Revision
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:12,
                    background:'#f8fafc', borderRadius:14, padding:'16px',
                    border:'1px dashed #e2e8f0' }}>
                    <div style={{ width:40, height:40, borderRadius:12,
                      background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:20 }}>⏳</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#0f172a', marginBottom:3 }}>
                        Awaiting Submission
                      </div>
                      <div style={{ fontSize:12, color:'#94a3b8' }}>
                        The freelancer is still working on your project
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN — CHAT ── */}
        <div className="pw-chat-wrap">
          <div className="pw-card" style={{ marginBottom:0 }}>
            <div className="pw-card-head">
              <div className="pw-card-head-icon" style={{ background:'#eff6ff' }}>💬</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8',
                  letterSpacing:'0.1em', textTransform:'uppercase' }}>Project Chat</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>
                  {project.freelancerName || 'Freelancer'}
                </div>
              </div>
              {project.freelancerId && (
                <span style={{ width:8, height:8, borderRadius:'50%',
                  background:'#22c55e', display:'block',
                  boxShadow:'0 0 0 3px rgba(34,197,94,0.2)' }}/>
              )}
            </div>

            {project.freelancerId ? (
              <>
                <div className="pw-chat-messages">
                  {(!chats?.messages || chats.messages.length === 0) && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
                      justifyContent:'center', height:'100%', gap:8, opacity:0.5 }}>
                      <div style={{ fontSize:32 }}>💬</div>
                      <div style={{ fontSize:13, color:'#94a3b8', fontWeight:600 }}>
                        No messages yet
                      </div>
                      <div style={{ fontSize:12, color:'#cbd5e1' }}>Start the conversation</div>
                    </div>
                  )}
                  {chats?.messages?.map((msg, i) => {
                    const isMe = msg.senderId === userId
                    return (
                      <div key={i} style={{ display:'flex',
                        flexDirection:'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <div className={`pw-msg ${isMe ? 'pw-msg-me' : 'pw-msg-them'}`}>
                          {msg.text}
                        </div>
                        <div className="pw-msg-time"
                          style={{ color:'#94a3b8', paddingLeft:isMe?0:4, paddingRight:isMe?4:0 }}>
                          {fmtTime(msg.time)}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={chatEndRef}/>
                </div>

                <div className="pw-chat-input-wrap">
                  <textarea
                    className="pw-chat-input"
                    rows={1}
                    placeholder="Type a message… (Enter to send)"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="pw-send-btn"
                    onClick={handleSend}
                    disabled={!message.trim()}>
                    <Icon d={icons.send} size={16} color="white"/>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding:'48px 24px', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🔒</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#0f172a', marginBottom:6 }}>
                  Chat Locked
                </div>
                <div style={{ fontSize:13, color:'#94a3b8', lineHeight:1.6 }}>
                  Chat will be enabled once a freelancer is assigned to this project.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProjectWorking