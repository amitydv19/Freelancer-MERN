import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'


/* ── SVG Icons ─────────────────────────────────────────── */
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
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

/* ── Left panel illustration ───────────────────────────── */
const PanelIllo = () => (
  <svg viewBox="0 0 340 300" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: 320, position: 'relative', zIndex: 1 }}>
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0.06"/>
      </linearGradient>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60a5fa"/>
        <stop offset="100%" stopColor="#a78bfa"/>
      </linearGradient>
    </defs>

    {/* Glow */}
    <ellipse cx="170" cy="150" rx="130" ry="120" fill="rgba(255,255,255,0.05)"/>

    {/* Card */}
    <rect x="55" y="35" width="230" height="210" rx="20"
      fill="url(#lg1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      style={{filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.2))'}}/>

    {/* Header */}
    <rect x="55" y="35" width="230" height="44" rx="20" fill="rgba(255,255,255,0.18)"/>
    <rect x="55" y="57" width="230" height="22" fill="rgba(255,255,255,0.18)"/>
    <circle cx="76"  cy="58" r="5" fill="rgba(255,255,255,0.6)"/>
    <circle cx="92"  cy="58" r="5" fill="rgba(255,255,255,0.3)"/>
    <circle cx="108" cy="58" r="5" fill="rgba(255,255,255,0.15)"/>
    <text x="185" y="63" fontSize="10" fill="white" textAnchor="middle"
      fontFamily="sans-serif" fontWeight="700">SB Works · Sign In</text>

    {/* Welcome text */}
    <text x="170" y="102" fontSize="14" fill="white" textAnchor="middle"
      fontFamily="sans-serif" fontWeight="800">Welcome back! 👋</text>
    <text x="170" y="118" fontSize="9" fill="rgba(255,255,255,0.55)" textAnchor="middle"
      fontFamily="sans-serif">Enter your credentials to continue</text>

    {/* Email field mock */}
    <rect x="72" y="128" width="196" height="26" rx="8" fill="rgba(255,255,255,0.12)"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <text x="84" y="145" fontSize="8.5" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">you@example.com</text>

    {/* Password field mock */}
    <rect x="72" y="162" width="196" height="26" rx="8" fill="rgba(255,255,255,0.12)"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <text x="84" y="179" fontSize="10" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">••••••••••</text>

    {/* Sign in button mock */}
    <rect x="72" y="196" width="196" height="30" rx="10" fill="url(#lg2)" opacity="0.9"/>
    <text x="170" y="216" fontSize="10" fill="white" textAnchor="middle"
      fontFamily="sans-serif" fontWeight="700">Sign In →</text>

    {/* Floating badge — active users */}
    <g style={{animation:'badgePop 0.5s 0.3s ease both'}}>
      <rect x="198" y="18" width="134" height="38" rx="12" fill="white"
        style={{filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.18))'}}/>
      <rect x="208" y="28" width="18" height="18" rx="9" fill="#fef3c7"/>
      <text x="217" y="40" fontSize="9" textAnchor="middle">🔥</text>
      <text x="232" y="33" fontSize="8.5" fill="#0f172a" fontFamily="sans-serif" fontWeight="700">242 online now</text>
      <text x="232" y="45" fontSize="7.5" fill="#64748b" fontFamily="sans-serif">Active freelancers</text>
    </g>

    {/* Floating badge — project hired */}
    <g style={{animation:'badgePop 0.5s 0.6s ease both'}}>
      <rect x="8" y="195" width="130" height="38" rx="12" fill="white"
        style={{filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.18))'}}/>
      <rect x="18" y="205" width="18" height="18" rx="9" fill="#dcfce7"/>
      <text x="27" y="217" fontSize="9" textAnchor="middle" fill="#16a34a">✓</text>
      <text x="42" y="210" fontSize="8.5" fill="#0f172a" fontFamily="sans-serif" fontWeight="700">Project hired!</text>
      <text x="42" y="222" fontSize="7.5" fill="#64748b" fontFamily="sans-serif">₹45k · Just now</text>
    </g>

    {/* Floating badge — review */}
    <g style={{animation:'badgePop 0.5s 0.9s ease both'}}>
      <rect x="170" y="258" width="150" height="38" rx="12" fill="#2563eb"
        style={{filter:'drop-shadow(0 4px 16px rgba(37,99,235,0.4))'}}>
      </rect>
      <text x="245" y="273" fontSize="8.5" fill="white" textAnchor="middle"
        fontFamily="sans-serif" fontWeight="700">⭐ 5.0 · New Review</text>
      <text x="245" y="286" fontSize="7.5" fill="rgba(255,255,255,0.7)" textAnchor="middle"
        fontFamily="sans-serif">"Exceptional work, will hire again"</text>
    </g>
  </svg>
)

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .lw * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blobFloat1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(28px,-18px) scale(1.04); }
  }
  @keyframes blobFloat2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-18px,22px) scale(1.04); }
  }
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes badgePop {
    from { opacity:0; transform: scale(0.8) translateY(8px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .lw-page {
    min-height: 100vh; width: 100%;
    background: linear-gradient(145deg, #eef2ff 0%, #f0f9ff 50%, #faf5ff 100%);
    display: flex; flex-direction: column;
    align-items: stretch; position: relative; overflow: hidden;
  }

  .blob1 { position:absolute; width:560px; height:560px; border-radius:50%;
    background:radial-gradient(circle,rgba(37,99,235,0.09) 0%,transparent 70%);
    top:-180px; left:-140px; animation:blobFloat1 10s ease-in-out infinite; pointer-events:none; }
  .blob2 { position:absolute; width:440px; height:440px; border-radius:50%;
    background:radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%);
    bottom:-120px; right:-100px; animation:blobFloat2 12s ease-in-out infinite; pointer-events:none; }
  .blob3 { position:absolute; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle,rgba(14,165,233,0.06) 0%,transparent 70%);
    top:40%; right:10%; animation:blobFloat1 8s 2s ease-in-out infinite; pointer-events:none; }

  /* Navbar */
  .lw-navbar {
    position:sticky; top:0; z-index:100;
    background:rgba(255,255,255,0.9);
    backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
    border-bottom:1px solid rgba(0,0,0,0.07);
    box-shadow:0 2px 20px rgba(0,0,0,0.06);
    display:flex; justify-content:space-between; align-items:center;
    padding:14px 32px;
  }

  /* Content */
  .lw-content {
    flex:1; display:flex; gap:64px;
    align-items:center; justify-content:center;
    padding:48px 5vw; position:relative; z-index:1;
  }

  /* Left info panel */
  .lw-info {
    flex:1; max-width:400px;
    display:flex; flex-direction:column; gap:0;
  }

  /* Card */
  .lw-card {
    background:white; border-radius:28px;
    box-shadow:0 8px 48px rgba(37,99,235,0.10), 0 2px 12px rgba(0,0,0,0.05);
    padding:44px 40px; width:100%; max-width:440px;
    animation:fadeUp 0.5s ease both;
    border:1px solid rgba(226,232,240,0.8);
    flex-shrink:0;
  }

  /* Input */
  .lw-field { position:relative; }
  .lw-field-icon {
    position:absolute; left:14px; top:50%;
    transform:translateY(-50%); pointer-events:none;
    display:flex; align-items:center;
  }
  .lw-input {
    width:100%; padding:13px 14px 13px 42px;
    border:1.5px solid #e2e8f0; border-radius:12px;
    font-size:14px; color:#0f172a; outline:none;
    background:#f8fafc; transition:all 0.2s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .lw-input:focus {
    border-color:#2563eb; background:white;
    box-shadow:0 0 0 4px rgba(37,99,235,0.08);
  }
  .lw-input::placeholder { color:#cbd5e1; }
  .lw-label {
    display:block; font-size:12.5px; font-weight:700;
    color:#374155; margin-bottom:7px;
  }

  /* Button */
  .lw-btn {
    width:100%; padding:14px; border:none; border-radius:13px;
    background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);
    color:white; font-weight:700; font-size:15px; cursor:pointer;
    box-shadow:0 4px 18px rgba(37,99,235,0.38);
    transition:all 0.22s; font-family:'Plus Jakarta Sans',sans-serif;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .lw-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,0.45); }
  .lw-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

  .lw-ghost {
    width:100%; padding:13px; background:white; color:#2563eb;
    font-weight:700; font-size:14px; border:2px solid #bfdbfe;
    border-radius:13px; cursor:pointer; transition:all 0.2s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .lw-ghost:hover { background:#eff6ff; border-color:#2563eb; }

  /* Testimonial card */
  .testi {
    background:white; border-radius:16px; padding:20px;
    border:1px solid #e2e8f0;
    box-shadow:0 4px 20px rgba(0,0,0,0.05);
    margin-top:16px;
  }

  .float-illo { animation:floatY 5s ease-in-out infinite; }
`

/* ── Component ─────────────────────────────────────────── */
const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext)
  const navigate                         = useNavigate()
  const [loading, setLoading]            = useState(false)
  const [showPwd, setShowPwd]            = useState(false)

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  await login();
  setLoading(false);  // ← this runs even on failure, which is fine
};

  return (
    <div className="lw lw-page">
      <style>{S}</style>

      {/* Blobs */}
      <div className="blob1"/><div className="blob2"/><div className="blob3"/>

      {/* ── NAVBAR ── */}
      <nav className="lw-navbar">
        <span onClick={() => navigate('/')}
          style={{ fontSize:20, fontWeight:800, color:'#2563eb',
            cursor:'pointer', letterSpacing:'-0.5px' }}>
          SB Works
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('/')}
            style={{ background:'none', border:'none', cursor:'pointer',
              fontSize:14, fontWeight:600, color:'#475569',
              fontFamily:'Plus Jakarta Sans,sans-serif', transition:'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='#2563eb'}
            onMouseLeave={e => e.target.style.color='#475569'}>
            Home
          </button>
          <span style={{ color:'#e2e8f0' }}>|</span>
          <span style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>
            New to SB Works?
          </span>
          <button onClick={() => setAuthType('register')}
            style={{ background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color:'white', fontWeight:700, fontSize:13,
              padding:'8px 20px', borderRadius:10, border:'none',
              cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif',
              boxShadow:'0 4px 12px rgba(37,99,235,0.3)', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="lw-content">

        {/* Left info panel */}
        <div className="lw-info">

          {/* Headline */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6,
              background:'#eff6ff', color:'#2563eb', fontSize:11, fontWeight:700,
              padding:'5px 12px', borderRadius:100, border:'1px solid #bfdbfe',
              marginBottom:14, letterSpacing:'0.06em', textTransform:'uppercase' }}>
              🔐 Secure Sign In
            </div>
            <h1 style={{ fontSize:'clamp(28px,3vw,38px)', fontWeight:800, color:'#0f172a',
              letterSpacing:'-1px', lineHeight:1.2, margin:'0 0 12px' }}>
              Welcome back to{' '}
              <span style={{ background:'linear-gradient(135deg,#2563eb,#7c3aed)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text' }}>
                SB Works
              </span>
            </h1>
            <p style={{ fontSize:15, color:'#64748b', lineHeight:1.7, margin:0 }}>
              Your next great project is waiting. Sign in to browse verified
              opportunities and connect with serious clients.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display:'flex', gap:24, marginBottom:28 }}>
            {[['12K+','Freelancers'],['4.2K+','Projects'],['98%','Satisfaction']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize:20, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600,
                  textTransform:'uppercase', letterSpacing:'0.06em', marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Illustration */}
          <div className="float-illo">
            <PanelIllo />
          </div>

          {/* Testimonial */}
          <div className="testi">
            <div style={{ display:'flex', gap:2, marginBottom:8 }}>
              {[1,2,3,4,5].map(i => <IconStar key={i}/>)}
            </div>
            <p style={{ fontSize:13, color:'#334155', lineHeight:1.6,
              margin:'0 0 12px', fontStyle:'italic' }}>
              "SB Works changed how I freelance. Every project here is real,
              scoped, and worth my time."
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:'50%',
                background:'linear-gradient(135deg,#2563eb,#7c3aed)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontWeight:700, fontSize:14 }}>P</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'#0f172a' }}>Priya Sharma</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>Full-Stack Developer, Bangalore</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── LOGIN CARD ── */}
        <div className="lw-card">

          {/* Header */}
          <div style={{ marginBottom:30, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:16,
              background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 16px',
              boxShadow:'0 4px 16px rgba(37,99,235,0.35)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </div>
            <h2 style={{ fontSize:26, fontWeight:800, color:'#0f172a',
              letterSpacing:'-0.5px', margin:'0 0 6px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize:14, color:'#64748b', margin:0 }}>
              Sign in to continue to SB Works
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom:18 }}>
              <label className="lw-label">Email address</label>
              <div className="lw-field">
                <div className="lw-field-icon"><IconMail /></div>
                <input type="email" placeholder="you@example.com" required
                  className="lw-input"
                  onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <label className="lw-label" style={{ margin:0 }}>Password</label>
                <span style={{ fontSize:12, color:'#2563eb', fontWeight:600, cursor:'pointer' }}>
                  Forgot password?
                </span>
              </div>
              <div className="lw-field">
                <div className="lw-field-icon"><IconLock /></div>
                <input type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••" required
                  className="lw-input" style={{ paddingRight:44 }}
                  onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', padding:0,
                    display:'flex', alignItems:'center' }}>
                  {showPwd ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24, marginTop:12 }}>
              <input type="checkbox" id="remember" style={{ width:15, height:15,
                accentColor:'#2563eb', cursor:'pointer' }} />
              <label htmlFor="remember" style={{ fontSize:13, color:'#64748b',
                fontWeight:500, cursor:'pointer' }}>
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="lw-btn" disabled={loading}>
              {loading
                ? 'Signing in…'
                : <><span>Sign In</span><IconArrow /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
            <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600, whiteSpace:'nowrap' }}>
              Don't have an account?
            </span>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }}/>
          </div>

          {/* Switch */}
          <button className="lw-ghost" onClick={() => setAuthType('register')}>
            Create a Free Account
          </button>

          {/* Trust note */}
          <p style={{ textAlign:'center', fontSize:11, color:'#94a3b8',
            margin:'16px 0 0', lineHeight:1.5 }}>
            🔒 Secured with 256-bit encryption
          </p>

        </div>
      </div>
      

      {/* Footer */}
      <p style={{ position:'relative', zIndex:1, textAlign:'center',
        fontSize:12, color:'#94a3b8', padding:'0 0 24px' }}>
        © {new Date().getFullYear()} SB Works · Terms · Privacy
      </p>
    </div>
  )
}

export default Login