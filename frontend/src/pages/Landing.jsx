import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const logos = [
  'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
]

const G = `
  /* ── Fonts ── */
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  /* ── Animations ── */
  @keyframes scrollLeft {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes badgePop {
    0%   { transform: scale(0.75); opacity: 0; }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes dash {
    to { stroke-dashoffset: 0; }
  }

  .au1 { animation: fadeUp 0.65s 0.0s ease both; }
  .au2 { animation: fadeUp 0.65s 0.12s ease both; }
  .au3 { animation: fadeUp 0.65s 0.24s ease both; }
  .au4 { animation: fadeUp 0.65s 0.36s ease both; }
  .float { animation: floatY 5s ease-in-out infinite; }
  .badge-pop { animation: badgePop 0.5s ease both; }
  .count-up  { animation: countUp 0.6s ease both; }
  .spin-slow { animation: spinSlow 20s linear infinite; }

  .logo-track {
    display: flex; gap: 4rem; width: max-content;
    padding: 0 2rem;
    animation: scrollLeft 28s linear infinite;
  }

  /* ── Sticky Navbar ── */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 1px 24px rgba(0,0,0,0.07);
  }

  /* ── Buttons ── */
  .btn-primary {
    background: linear-gradient(135deg,#2563eb,#1d4ed8);
    color: white; font-weight: 700; border-radius: 12px;
    padding: 12px 32px; cursor: pointer;
    box-shadow: 0 4px 16px rgba(37,99,235,0.38);
    transition: all 0.22s ease; border: none; outline: none;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.45); }

  .btn-outline {
    background: white; color: #2563eb; font-weight: 700;
    border: 2px solid #2563eb; border-radius: 12px;
    padding: 12px 32px; cursor: pointer;
    transition: all 0.22s ease;
  }
  .btn-outline:hover { background: #eff6ff; transform: translateY(-2px); }

  .btn-ghost {
    background: transparent; color: #2563eb; font-weight: 600;
    border: 2px solid #bfdbfe; border-radius: 10px;
    padding: 8px 20px; cursor: pointer; font-size: 14px;
    transition: all 0.2s ease;
  }
  .btn-ghost:hover { background: #eff6ff; border-color: #2563eb; }

  /* ── Section label pill ── */
  .section-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #eff6ff; color: #2563eb;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 6px 14px; border-radius: 100px;
    border: 1px solid #bfdbfe; margin-bottom: 16px;
  }

  /* ── Gradient headings ── */
  .grad-text {
    background: linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Glow cards ── */
  .glow-card {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
  }
  .glow-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(37,99,235,0.14);
    border-color: #bfdbfe;
  }

  /* ── Step connector line ── */
  .step-line {
    position: absolute; top: 28px; left: calc(50% + 48px);
    width: calc(100% - 96px); height: 2px;
    background: linear-gradient(90deg,#2563eb,#7c3aed);
    opacity: 0.25;
  }

  /* ── Dark section ── */
  .dark-section {
    background: linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);
  }

  /* ── Stats counter ── */
  .stat-num {
    font-size: 48px; font-weight: 800; line-height: 1;
    background: linear-gradient(135deg,#2563eb,#7c3aed);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Testimonial card ── */
  .testi-card {
    background: white; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    padding: 28px; transition: all 0.3s ease;
  }
  .testi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(37,99,235,0.1);
  }

  /* ── CTA band ── */
  .cta-band {
    background: linear-gradient(135deg,#2563eb 0%,#4f46e5 50%,#7c3aed 100%);
    border-radius: 28px;
    position: relative; overflow: hidden;
  }
  .cta-band::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 70%);
  }

  /* ── Hero background ── */
  .hero-bg {
    background: radial-gradient(ellipse 90% 70% at 70% 40%, #dbeafe 0%, #f0f9ff 45%, #f8fafc 100%);
    min-height: 90vh;
  }

  /* ── Feature icon circle ── */
  .icon-circle {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-bottom: 16px;
  }
`

/* ════════════════════════════════════════════
   SVG ILLUSTRATIONS
════════════════════════════════════════════ */

const HeroIllustration = () => (
  <svg viewBox="0 0 500 440" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xl">
    <defs>
      <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <filter id="card-shadow">
        <feDropShadow dx="0" dy="8" stdDeviation="20" floodColor="#2563eb" floodOpacity="0.12" />
      </filter>
    </defs>

    {/* Blob bg */}
    <ellipse cx="250" cy="220" rx="210" ry="195" fill="url(#hg1)" opacity="0.07" />

    {/* Main card */}
    <rect x="70" y="60" width="340" height="240" rx="22" fill="white" filter="url(#card-shadow)" />

    {/* Header */}
    <rect x="70" y="60" width="340" height="50" rx="22" fill="url(#hg1)" />
    <rect x="70" y="82" width="340" height="28" fill="url(#hg1)" />
    <circle cx="100" cy="85" r="7" fill="rgba(255,255,255,0.35)" />
    <circle cx="122" cy="85" r="7" fill="rgba(255,255,255,0.2)" />
    <circle cx="144" cy="85" r="7" fill="rgba(255,255,255,0.1)" />
    <text x="190" y="90" fontSize="11" fill="white" fontFamily="sans-serif" fontWeight="700">SB Works · Dashboard</text>

    {/* User row */}
    <circle cx="108" cy="145" r="24" fill="#bfdbfe" />
    <circle cx="108" cy="137" r="11" fill="#93c5fd" />
    <ellipse cx="108" cy="162" rx="15" ry="9" fill="#93c5fd" />
    <text x="142" y="140" fontSize="13" fill="#0f172a" fontFamily="sans-serif" fontWeight="800">Priya Sharma</text>
    <text x="142" y="157" fontSize="10" fill="#64748b" fontFamily="sans-serif">Full-Stack Developer · ⭐ 5.0</text>
    <rect x="330" y="130" width="62" height="22" rx="11" fill="#dcfce7" />
    <text x="361" y="145" fontSize="9" fill="#16a34a" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">● Available</text>

    {/* Divider */}
    <line x1="88" y1="175" x2="392" y2="175" stroke="#f1f5f9" strokeWidth="1.5" />

    {/* Stats */}
    {[
      { x: 88,  color: '#eff6ff', numColor: '#2563eb', num: '32', label: 'Projects' },
      { x: 192, color: '#f0fdf4', numColor: '#16a34a', num: '$9.4k', label: 'Earned' },
      { x: 296, color: '#fef9f0', numColor: '#d97706', num: '100%', label: 'On-Time' },
    ].map(({ x, color, numColor, num, label }) => (
      <g key={x}>
        <rect x={x} y="187" width="88" height="56" rx="12" fill={color} />
        <text x={x + 44} y="210" fontSize="17" fill={numColor} fontFamily="sans-serif" fontWeight="800" textAnchor="middle">{num}</text>
        <text x={x + 44} y="230" fontSize="9" fill="#64748b" fontFamily="sans-serif" textAnchor="middle">{label}</text>
      </g>
    ))}

    {/* Bar chart */}
    {[18, 28, 22, 35, 25, 30, 38].map((h, i) => (
      <rect key={i} x={88 + i * 18} y={276 - h} width="12" height={h} rx="4"
        fill={i === 6 ? 'url(#hg1)' : i === 3 ? '#93c5fd' : '#dbeafe'} />
    ))}
    <text x="230" y="284" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">Weekly activity ↑ 31%</text>

    {/* Floating badge — new project */}
    <g className="badge-pop">
      <rect x="316" y="42" width="148" height="44" rx="14" fill="white"
        style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.13))' }} />
      <circle cx="336" cy="64" r="9" fill="#dcfce7" />
      <text x="336" y="68" fontSize="11" fill="#16a34a" textAnchor="middle">✓</text>
      <text x="352" y="60" fontSize="10" fill="#0f172a" fontFamily="sans-serif" fontWeight="700">New Project!</text>
      <text x="352" y="74" fontSize="9" fill="#64748b" fontFamily="sans-serif">React App · ₹65,000</text>
    </g>

    {/* Floating badge — message */}
    <g className="badge-pop" style={{ animationDelay: '0.25s' }}>
      <rect x="44" y="312" width="152" height="44" rx="14" fill="white"
        style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.13))' }} />
      <circle cx="66" cy="334" r="9" fill="#eff6ff" />
      <text x="66" y="338" fontSize="10" fill="#2563eb" textAnchor="middle">💬</text>
      <text x="83" y="329" fontSize="10" fill="#0f172a" fontFamily="sans-serif" fontWeight="700">Client replied</text>
      <text x="83" y="343" fontSize="9" fill="#64748b" fontFamily="sans-serif">"Ship it — great work!"</text>
    </g>

    {/* Floating badge — delivered */}
    <g className="badge-pop" style={{ animationDelay: '0.5s' }}>
      <rect x="306" y="322" width="156" height="44" rx="14" fill="url(#hg1)"
        style={{ filter: 'drop-shadow(0 6px 20px rgba(37,99,235,0.35))' }} />
      <text x="384" y="340" fontSize="10" fill="white" fontFamily="sans-serif" textAnchor="middle" fontWeight="700">✅ Delivered</text>
      <text x="384" y="356" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif" textAnchor="middle">Payment released · ₹65k</text>
    </g>
  </svg>
)

const WorkflowIllustration = () => (
  <svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xl mx-auto mt-10">
    <defs>
      <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    {/* connector */}
    <line x1="80" y1="80" x2="360" y2="80" stroke="url(#wg)" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
    {/* circles */}
    {[
      { cx: 80,  label: 'Post', sub: 'Project' },
      { cx: 220, label: 'Match', sub: 'Talent' },
      { cx: 360, label: 'Ship', sub: 'Work' },
    ].map(({ cx, label, sub }) => (
      <g key={cx}>
        <circle cx={cx} cy="80" r="36" fill="url(#wg)" opacity="0.1" />
        <circle cx={cx} cy="80" r="28" fill="url(#wg)" opacity="0.85" />
        <text x={cx} y="76" fontSize="11" fill="white" textAnchor="middle" fontFamily="sans-serif" fontWeight="800">{label}</text>
        <text x={cx} y="89" fontSize="9"  fill="rgba(255,255,255,0.75)" textAnchor="middle" fontFamily="sans-serif">{sub}</text>
        <text x={cx} y="130" fontSize="11" fill="#334155" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">{label} a {sub}</text>
      </g>
    ))}
  </svg>
)

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Landing = () => {
  const navigate    = useNavigate()
  const heroRef     = useRef(null)
  const workflowRef = useRef(null)
  const contactRef  = useRef(null)
  const scrollTo    = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
  const role  = localStorage.getItem("usertype")
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  // ✅ Only redirect if ALL three exist and are non-empty
  if (!token || !role || !userId) {
    localStorage.clear() // clear any partial/stale data
    return
  }

  const routes = {
    freelancer: "/freelancer",
    client: "/client",
    admin: "/admin",
  }

  const destination = routes[role]

  if (destination) {
    navigate(destination)
  } else {
    localStorage.clear()
  }
}, [])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff' }}>
      <style>{G}</style>

      {/* ════ NAVBAR ════ */}
      <nav className="navbar flex justify-between items-center px-8 py-4">
        <span onClick={() => scrollTo(heroRef)}
          style={{ fontSize: 22, fontWeight: 800, color: '#2563eb', cursor: 'pointer', letterSpacing: '-0.5px' }}>
          SB Works
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 600, color: '#475569' }}>
            {['Home', 'Workflow', 'Contact'].map((label, i) => (
              <button key={label}
                onClick={() => i === 0 ? scrollTo(heroRef) : i === 1 ? scrollTo(workflowRef) : scrollTo(contactRef)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                  color: '#475569', fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2563eb'}
                onMouseLeave={e => e.target.style.color = '#475569'}>
                {label}


          
              </button>
            ))}
            
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => navigate('/authenticate')}>Log In</button>
            <button className="btn-primary" style={{ padding: '8px 22px', fontSize: 14 }}
              onClick={() => navigate('/authenticate?type=register')}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Content wrapper — overflow hidden here keeps sticky navbar working */}
      <div style={{ overflowX: 'hidden' }}>

      {/* ════ HERO ════ */}
      <section ref={heroRef} className="hero-bg" style={{ display: 'flex', alignItems: 'center', padding: '0 5vw' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', padding: '80px 0' }}>
          <div>
            <div className="au1 section-pill">🚀 Freelance Platform · India</div>
            <h1 className="au2" style={{ fontSize: 'clamp(38px,5vw,62px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-1.5px', color: '#0f172a', margin: '0 0 20px' }}>
              Where Talent Meets{' '}
              <span className="grad-text">Real Opportunities</span>
            </h1>
            <p className="au3" style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7,
              maxWidth: 420, margin: '0 0 36px' }}>
              SB Works connects serious freelancers with genuine clients.
              No spam. No fake projects. Just focused collaboration.
            </p>
            <div className="au4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <button className="btn-primary" onClick={() => navigate('/authenticate?type=register')}>Start as Client</button>
              <button className="btn-outline" onClick={() => navigate('/authenticate?type=register')}>Start as Freelancer</button>
            </div>
            <div className="au4" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13,
              color: '#64748b', fontWeight: 600 }}>
              {['✓ Verified Projects', '✓ Zero Spam', '✓ Free to Join'].map(t => (
                <span key={t} style={{ color: '#16a34a' }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="float"><HeroIllustration /></div>
        </div>
      </section>

      {/* ════ LOGO SLIDER ════ */}
      <section style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
        background: '#fafafa', padding: '40px 0', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', letterSpacing: '0.12em',
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 28 }}>
          Trusted by teams at
        </p>
        <div style={{ overflow: 'hidden' }}>
          <div className="logo-track">
            {[...logos, ...logos].map((src, i) => (
              <img key={i} src={src} alt="" style={{ height: 34, filter: 'grayscale(1)', opacity: 0.5,
                transition: 'all 0.3s' }}
                onMouseEnter={e => { e.target.style.filter = 'none'; e.target.style.opacity = 1 }}
                onMouseLeave={e => { e.target.style.filter = 'grayscale(1)'; e.target.style.opacity = 0.5 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ STATS BAND ════ */}
      <section style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)',
        padding: '72px 5vw', marginTop: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { num: '12K+',  label: 'Freelancers',    sub: 'active on platform' },
            { num: '4.2K+', label: 'Projects',        sub: 'successfully delivered' },
            { num: '98%',   label: 'Satisfaction',    sub: 'client rating' },
            { num: '₹2Cr+', label: 'Paid Out',        sub: 'to freelancers' },
          ].map(({ num, label, sub }) => (
            <div key={label} className="count-up">
              <div className="stat-num">{num}</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginTop: 8 }}>{label}</div>
              <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PROBLEM ════ */}
      <section style={{ padding: '100px 5vw', textAlign: 'center',
        background: 'linear-gradient(180deg,#f8fafc,#fff)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-pill">💔 The Problem</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-1px', margin: '0 0 20px' }}>
            Freelancing today is <span className="grad-text">broken</span>
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.75 }}>
            Clients face unreliable delivery and unclear proposals.
            Freelancers waste time on low-quality projects and endless price wars.
            SB Works fixes this with clarity, structure, and verified intent.
          </p>
        </div>

        {/* Pain points grid */}
        <div style={{ maxWidth: 1100, margin: '56px auto 0',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {[
            { icon: '😤', title: 'Unclear briefs',      text: 'Vague projects waste hours of back-and-forth before any real work starts.' },
            { icon: '🚫', title: 'Fake clients',         text: 'Bots and time-wasters flood platforms with zero-budget "opportunities".' },
            { icon: '💸', title: 'Race to the bottom',   text: 'Price wars destroy quality. The cheapest wins, not the best.' },
          ].map(({ icon, title, text }) => (
            <div key={title} className="glow-card" style={{ padding: '32px 28px', textAlign: 'left' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ WHY SB WORKS ════ */}
      <section style={{ padding: '0 5vw 100px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-pill">✨ The Solution</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: 0 }}>
              Why SB Works <span className="grad-text">actually works</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {[
              { icon: '🔍', color: '#eff6ff', title: 'Verified Projects',
                text: 'Every project is reviewed for clarity and genuine intent before it goes live.' },
              { icon: '💬', color: '#f0fdf4', title: 'Smart Communication',
                text: 'All discussions stay in one structured place. No scattered DMs.' },
              { icon: '📋', color: '#fef9f0', title: 'Structured Workflow',
                text: 'Clear stages from application to delivery. No surprises.' },
              { icon: '⭐', color: '#fdf4ff', title: 'Reputation System',
                text: 'Earn trust over time. Verified ratings that actually mean something.' },
              { icon: '🛡️', color: '#eff6ff', title: 'Safe Payments',
                text: 'Funds secured before work begins. Get paid on delivery.' },
              { icon: '🚀', color: '#f0fdf4', title: 'Growth Tools',
                text: 'Portfolio, proposals, and analytics to grow your freelance career.' },
            ].map(({ icon, color, title, text }) => (
              <div key={title} className="glow-card" style={{ padding: '32px 28px' }}>
                <div className="icon-circle" style={{ background: color }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section ref={workflowRef}
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)', padding: '100px 5vw' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-pill" style={{ background: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.15)', color: '#93c5fd' }}>
              🗺️ How It Works
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: 'white',
              letterSpacing: '-1px', margin: '0 0 16px' }}>
              From posting to <span className="grad-text">payment</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Three clear steps, zero confusion. The whole process is transparent and structured.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              { n: '01', icon: '📝', title: 'Create & Explore',
                desc: 'Clients post detailed, verified projects. Freelancers browse and apply with focused proposals.',
                img: '/src/images/step1.svg' },
              { n: '02', icon: '🤝', title: 'Connect & Assign',
                desc: 'Discuss scope, timelines and budget. Both sides agree before the project is officially assigned.',
                img: '/src/images/step2.svg' },
              { n: '03', icon: '🚀', title: 'Deliver & Get Paid',
                desc: 'Submit work, get client approval, receive payment — all through a transparent workflow.',
                img: '/src/images/step3.svg' },
            ].map(({ n, icon, title, desc, img }) => (
              <div key={n} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.1)', padding: '36px 28px',
                transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', letterSpacing: '0.1em',
                  marginBottom: 16 }}>STEP {n}</div>
                <img src={img} alt={title} style={{ height: 80, marginBottom: 20 }}
                  onError={e => { e.target.style.display = 'none' }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 12 }}>
                  {icon} {title}
                </h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{desc}</p>
                <div style={{ marginTop: 24, width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 15,
                  boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                  {n.replace('0', '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section style={{ padding: '100px 5vw', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-pill">💬 Testimonials</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-1px', margin: 0 }}>
              What people are <span className="grad-text">saying</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { name: 'Arjun Mehta', role: 'Startup Founder, Delhi',
                quote: 'Found a brilliant developer in 24 hours. The project brief system meant zero back-and-forth. Hired again within a week.',
                stars: 5 },
              { name: 'Sneha Reddy', role: 'UI/UX Freelancer, Bangalore',
                quote: 'SB Works is the only platform where clients actually read proposals. My acceptance rate doubled from day one.',
                stars: 5 },
              { name: 'Ravi Tiwari', role: 'Product Manager, Mumbai',
                quote: 'The structured workflow saved our project. Clear milestones, no ghosting, payment on time. Highly recommended.',
                stars: 5 },
            ].map(({ name, role, quote, stars }) => (
              <div key={name} className="testi-card">
                <div style={{ marginBottom: 16, color: '#f59e0b', fontSize: 16 }}>
                  {'★'.repeat(stars)}
                </div>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.75,
                  marginBottom: 20, fontStyle: 'italic' }}>"{quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 16 }}>
                    {name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FEATURE CARDS ════ */}
      <section style={{ padding: '100px 5vw', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-pill">🎯 Built For You</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-1px', margin: 0 }}>
              Everything you need to <span className="grad-text">succeed</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
            {[
              { icon: '💼', color: '#eff6ff', title: 'Built for serious freelancers',
                text: 'Work only on projects with clear scope and real intent. No bidding chaos, no fake clients, no time wasted.' },
              { icon: '🎯', color: '#f0fdf4', title: 'Focus on delivery, not chasing',
                text: 'Centralized communication and structured steps let you focus on quality work and long-term client relationships.' },
              { icon: '🏆', color: '#fdf4ff', title: 'Hire with clarity and confidence',
                text: 'Receive proposals that actually address your requirements. Assign projects only after expectations are aligned.' },
              { icon: '📊', color: '#fef9f0', title: 'Transparent execution',
                text: 'Track progress, communication, and delivery without micromanagement or guesswork. Full visibility always.' },
            ].map(({ icon, color, title, text }) => (
              <div key={title} className="glow-card" style={{ padding: '36px 32px', display: 'flex', gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: color,
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24 }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BAND ════ */}
      <section style={{ padding: '0 5vw 100px' }}>
        <div className="cta-band" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 60px',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: 'white',
              letterSpacing: '-1px', margin: '0 0 12px' }}>
              Ready to work smarter?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, margin: 0 }}>
              Join 12,000+ professionals already using SB Works.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate('/authenticate?type=register')}
              style={{ background: 'white', color: '#2563eb', fontWeight: 700, fontSize: 15,
                padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
              Get Started Free →
            </button>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer ref={contactRef}
        style={{ background: '#0a0a0f', color: '#64748b', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 5vw 40px',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 14,
              letterSpacing: '-0.5px' }}>SB Works</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 260, color: '#64748b' }}>
              Where serious freelancers and genuine clients collaborate
              with clarity and a structured workflow.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['𝕏', 'in', '𝑓'].map(s => (
                <div key={s} style={{ width: 36, height: 36, borderRadius: '50%',
                  background: '#1e293b', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#94a3b8', fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {[
            { title: 'Platform', links: ['Browse Projects', 'Find Freelancers', 'How it Works', 'Pricing'] },
            { title: 'Company',  links: ['About Us', 'Blog', 'Careers', 'Press'] },
            { title: 'Support',  links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 18,
                letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(l => (
                  <li key={l} style={{ fontSize: 14, color: '#64748b', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#e2e8f0'}
                    onMouseLeave={e => e.target.style.color = '#64748b'}>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1e293b', margin: '0 5vw', padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 13, color: '#475569' }}>
          <span>© {new Date().getFullYear()} SB Works. All rights reserved.</span>
          <span>Made with ❤️ in Lucknow, India</span>
        </div>
      </footer>
      </div> {/* end content wrapper */}
    </div>
  )
}

export default Landing