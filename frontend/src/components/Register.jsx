import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'

/* ── SVG Icons ─────────────────────────────────────────── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconBriefcase = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const IconBuilding = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconShield = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .rw * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blobFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(30px,-20px) scale(1.05); }
  }
  @keyframes blobFloat2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-20px,25px) scale(1.04); }
  }

  .rw-page {
    min-height: 100vh; width: 100%;
    background: linear-gradient(145deg, #eef2ff 0%, #f0f9ff 50%, #faf5ff 100%);
    display: flex; flex-direction: column;
    align-items: stretch; position: relative; overflow: hidden;
  }

  .rw-navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 32px;
  }

  .rw-content {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
  }

  .blob1 {
    position: absolute; width: 560px; height: 560px; border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%);
    top: -180px; left: -140px; animation: blobFloat1 10s ease-in-out infinite;
    pointer-events: none;
  }
  .blob2 {
    position: absolute; width: 440px; height: 440px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%);
    bottom: -120px; right: -100px; animation: blobFloat2 12s ease-in-out infinite;
    pointer-events: none;
  }
  .blob3 {
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%);
    top: 45%; right: 8%; animation: blobFloat1 8s 2s ease-in-out infinite;
    pointer-events: none;
  }

  .rw-card {
    background: white; border-radius: 28px; position: relative; z-index: 1;
    box-shadow: 0 8px 48px rgba(37,99,235,0.10), 0 2px 12px rgba(0,0,0,0.05);
    padding: 44px 40px; width: 100%; max-width: 480px;
    animation: fadeUp 0.5s ease both;
    border: 1px solid rgba(226,232,240,0.8);
  }

  /* Inputs */
  .rw-field { position: relative; }
  .rw-field-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
    display: flex; align-items: center;
  }
  .rw-input {
    width: 100%; padding: 13px 14px 13px 42px;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-size: 14px; color: #0f172a; outline: none;
    background: #f8fafc; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .rw-input:focus {
    border-color: #2563eb; background: white;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
  }
  .rw-input::placeholder { color: #cbd5e1; }
  .rw-label {
    display: block; font-size: 12.5px; font-weight: 700;
    color: #374155; margin-bottom: 7px; letter-spacing: 0.01em;
  }

  /* Role cards */
  .rw-role {
    flex: 1; border: 2px solid #e2e8f0; border-radius: 14px;
    padding: 16px 8px 14px; text-align: center; cursor: pointer;
    transition: all 0.22s; background: #f8fafc; position: relative;
  }
  .rw-role:hover { border-color: #93c5fd; background: #f0f9ff; transform: translateY(-2px); }
  .rw-role.active { transform: translateY(-2px); }

  .rw-check {
    position: absolute; top: 8px; right: 8px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #2563eb;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: scale(0.4); transition: all 0.2s;
  }
  .rw-role.active .rw-check { opacity: 1; transform: scale(1); }

  /* Button */
  .rw-btn {
    width: 100%; padding: 14px; border: none; border-radius: 13px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white; font-weight: 700; font-size: 15px; cursor: pointer;
    box-shadow: 0 4px 18px rgba(37,99,235,0.38);
    transition: all 0.22s; font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .rw-btn:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.45);
  }
  .rw-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  .rw-ghost {
    width: 100%; padding: 13px; background: white; color: #2563eb;
    font-weight: 700; font-size: 14px; border: 2px solid #bfdbfe;
    border-radius: 13px; cursor: pointer; transition: all 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .rw-ghost:hover { background: #eff6ff; border-color: #2563eb; }

  /* Trust pills */
  .trust-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; }
  .trust-pill {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    color: #15803d; font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 100px;
  }
`

/* ── Role definitions ──────────────────────────────────── */
const roles = [
  { value: 'freelancer', label: 'Freelancer', desc: 'Find projects',   icon: (a) => <IconBriefcase color={a ? '#2563eb' : '#94a3b8'} />, activeColor: '#2563eb', activeBg: '#dbeafe', iconBg: (a) => a ? '#eff6ff' : '#f1f5f9' },
  { value: 'client',     label: 'Client',     desc: 'Hire talent',     icon: (a) => <IconBuilding  color={a ? '#7c3aed' : '#94a3b8'} />, activeColor: '#7c3aed', activeBg: '#ede9fe', iconBg: (a) => a ? '#fdf4ff' : '#f1f5f9' },
  { value: 'admin',      label: 'Admin',      desc: 'Manage platform', icon: (a) => <IconShield    color={a ? '#0891b2' : '#94a3b8'} />, activeColor: '#0891b2', activeBg: '#cffafe', iconBg: (a) => a ? '#ecfeff' : '#f1f5f9' },
]

/* ── Component ─────────────────────────────────────────── */
const Register = ({ setAuthType }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register } = useContext(GeneralContext)
  const navigate                                                       = useNavigate()
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading]           = useState(false)
  const [showPwd, setShowPwd]           = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    await register()
    setLoading(false)
  }

  const handleRole = (val) => { setSelectedRole(val); setUsertype(val) }

  return (
    <div className="rw rw-page">
      <style>{S}</style>

      {/* Animated background blobs */}
      <div className="blob1"/><div className="blob2"/><div className="blob3"/>

      {/* ── NAVBAR ── */}
      <nav className="rw-navbar">
        <span onClick={() => navigate('/')}
          style={{ fontSize: 20, fontWeight: 800, color: '#2563eb',
            cursor: 'pointer', letterSpacing: '-0.5px' }}>
          SB Works
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: '#475569',
              fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#2563eb'}
            onMouseLeave={e => e.target.style.color = '#475569'}>
            Home
          </button>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Already have an account?
          </span>
          <button onClick={() => setAuthType('login')}
            style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color: 'white', fontWeight: 700, fontSize: 13,
              padding: '8px 20px', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Sign In
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="rw-content">

      {/* Trust pills */}
      <div className="trust-pills" style={{ position: 'relative', zIndex: 1 }}>
        {['✓ Verified Projects', '✓ Secure Payments', '✓ Free to Join'].map(t => (
          <span key={t} className="trust-pill">{t}</span>
        ))}
      </div>

      {/* ── CARD ── */}
      <div className="rw-card">

        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.5px', margin: '0 0 8px' }}>
            Create your account
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Join thousands of freelancers and clients
          </p>
        </div>

        <form onSubmit={handleRegister}>

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label className="rw-label">Username</label>
            <div className="rw-field">
              <div className="rw-field-icon"><IconUser /></div>
              <input type="text" placeholder="yourname" required className="rw-input"
                onChange={e => setUsername(e.target.value)} />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label className="rw-label">Email address</label>
            <div className="rw-field">
              <div className="rw-field-icon"><IconMail /></div>
              <input type="email" placeholder="you@example.com" required className="rw-input"
                onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <label className="rw-label">Password</label>
            <div className="rw-field">
              <div className="rw-field-icon"><IconLock /></div>
              <input type={showPwd ? 'text' : 'password'}
                placeholder="Min. 8 characters" required className="rw-input"
                style={{ paddingRight: 44 }}
                onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center' }}>
                {showPwd ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 26 }}>
            <label className="rw-label">I am a…</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {roles.map(({ value, label, desc, icon, activeColor, activeBg, iconBg }) => {
                const active = selectedRole === value
                return (
                  <div key={value}
                    className={`rw-role${active ? ' active' : ''}`}
                    style={active ? {
                      borderColor: activeColor,
                      background: activeBg,
                      boxShadow: `0 0 0 4px ${activeColor}18`
                    } : {}}
                    onClick={() => handleRole(value)}>

                    {/* Check badge */}
                    <div className="rw-check" style={{ background: activeColor }}>
                      <IconCheck />
                    </div>

                    {/* Icon tile */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 13,
                      background: iconBg(active),
                      border: `1.5px solid ${active ? activeColor + '35' : '#e2e8f0'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px', transition: 'all 0.2s'
                    }}>
                      {icon(active)}
                    </div>

                    <div style={{ fontSize: 12.5, fontWeight: 700,
                      color: active ? activeColor : '#334155', marginBottom: 3 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                      {desc}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="rw-btn" disabled={loading || !selectedRole}>
            {loading
              ? 'Creating account…'
              : <><span>Create Account</span><IconArrow /></>
            }
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}/>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Already have an account?
          </span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}/>
        </div>

        {/* Switch to login */}
        <button className="rw-ghost" onClick={() => setAuthType('login')}>
          Sign In Instead
        </button>

      </div>

      {/* Footer note */}
      <p style={{ position: 'relative', zIndex: 1, marginTop: 20, fontSize: 12,
        color: '#94a3b8', textAlign: 'center' }}>
        By signing up, you agree to our Terms & Privacy Policy
      </p>

      </div> {/* end rw-content */}
    </div>
  )
}

export default Register