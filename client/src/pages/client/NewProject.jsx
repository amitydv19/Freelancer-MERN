import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

/* ── Styles ─────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .np * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

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
  @keyframes tagPop {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .np-page {
    min-height: 100vh;
    background: linear-gradient(145deg, #eef2ff 0%, #f0f9ff 50%, #faf5ff 100%);
    position: relative; overflow-x: hidden;
  }
  .np-blob1 {
    position: fixed; width: 580px; height: 580px; border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%);
    top: -180px; left: -140px; pointer-events: none;
    animation: blobFloat1 11s ease-in-out infinite;
  }
  .np-blob2 {
    position: fixed; width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    bottom: -130px; right: -110px; pointer-events: none;
    animation: blobFloat2 13s ease-in-out infinite;
  }

  /* Navbar */
  .np-navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 24px rgba(0,0,0,0.06);
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 32px; height: 64px;
  }

  /* Page content */
  .np-content {
    max-width: 760px; margin: 0 auto;
    padding: 48px 24px 80px;
    position: relative; z-index: 1;
  }

  /* Progress steps */
  .np-steps {
    display: flex; align-items: center; gap: 0;
    margin-bottom: 36px;
    animation: fadeUp 0.4s ease both;
  }
  .np-step {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600;
  }
  .np-step-circle {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
    transition: all 0.3s;
  }
  .np-step-line {
    flex: 1; height: 2px; min-width: 40px;
    background: #e2e8f0; margin: 0 8px;
    transition: background 0.3s;
  }
  .np-step-line.done { background: linear-gradient(90deg, #2563eb, #7c3aed); }

  /* Card */
  .np-card {
    background: white; border-radius: 28px;
    box-shadow: 0 8px 48px rgba(37,99,235,0.10), 0 2px 12px rgba(0,0,0,0.05);
    border: 1px solid rgba(226,232,240,0.8);
    overflow: hidden;
    animation: fadeUp 0.5s 0.1s ease both;
  }

  .np-card-header {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #4f46e5 100%);
    padding: 32px 36px 28px;
    position: relative; overflow: hidden;
  }
  .np-card-header::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 70%);
  }

  .np-card-body { padding: 36px; }

  /* Form fields */
  .np-field { margin-bottom: 24px; }
  .np-label {
    display: flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 700; color: #374155;
    margin-bottom: 8px; letter-spacing: 0.01em;
  }
  .np-label-icon {
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
  }
  .np-input, .np-textarea {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid #e2e8f0; border-radius: 13px;
    font-size: 14px; color: #0f172a; outline: none;
    background: #f8fafc; transition: all 0.22s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    resize: none;
  }
  .np-input:focus, .np-textarea:focus {
    border-color: #2563eb; background: white;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
  }
  .np-input::placeholder, .np-textarea::placeholder { color: #cbd5e1; }
  .np-input.error { border-color: #fca5a5; background: #fff5f5; }
  .np-input.error:focus { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.08); }

  /* Budget input with prefix */
  .np-budget-wrap {
    position: relative; display: flex; align-items: center;
  }
  .np-budget-prefix {
    position: absolute; left: 14px;
    font-size: 16px; font-weight: 700; color: #64748b;
    pointer-events: none;
  }
  .np-budget-input {
    padding-left: 32px !important;
  }

  /* Skill tags */
  .np-tags-wrap {
    display: flex; flex-wrap: wrap; gap: 8px;
    min-height: 48px; padding: 10px 14px;
    border: 1.5px solid #e2e8f0; border-radius: 13px;
    background: #f8fafc; cursor: text; transition: all 0.22s;
    align-items: center;
  }
  .np-tags-wrap:focus-within {
    border-color: #2563eb; background: white;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
  }
  .np-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    color: #2563eb; font-size: 12px; font-weight: 700;
    padding: 4px 10px 4px 12px; border-radius: 100px;
    border: 1px solid #bfdbfe;
    animation: tagPop 0.2s ease both;
  }
  .np-tag-remove {
    background: none; border: none; cursor: pointer;
    color: #93c5fd; font-size: 14px; padding: 0; line-height: 1;
    display: flex; align-items: center; transition: color 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .np-tag-remove:hover { color: #2563eb; }
  .np-tag-input {
    border: none; outline: none; background: none;
    font-size: 13px; color: #0f172a; min-width: 100px; flex: 1;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .np-tag-input::placeholder { color: #cbd5e1; }

  /* Hint text */
  .np-hint {
    font-size: 12px; color: #94a3b8; margin-top: 6px;
    display: flex; align-items: center; gap: 4px;
  }

  /* Budget preview */
  .np-budget-preview {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1px solid #bbf7d0; border-radius: 10px;
    padding: 10px 16px; margin-top: 8px;
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #15803d; font-weight: 600;
  }

  /* Char count */
  .np-char {
    font-size: 11px; color: #94a3b8; text-align: right;
    margin-top: 5px; font-weight: 500;
  }
  .np-char.warn { color: #f59e0b; }
  .np-char.limit { color: #ef4444; }

  /* Submit button */
  .np-submit {
    width: 100%; padding: 15px; border: none; border-radius: 14px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white; font-weight: 700; font-size: 16px; cursor: pointer;
    box-shadow: 0 4px 20px rgba(37,99,235,0.40);
    transition: all 0.22s; font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 8px;
  }
  .np-submit:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 8px 32px rgba(37,99,235,0.50);
  }
  .np-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .np-spinner {
    width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* Back button */
  .np-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    padding: 8px 0; transition: color 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .np-back:hover { color: #2563eb; }

  /* Error message */
  .np-error {
    font-size: 12px; color: #ef4444; font-weight: 600;
    margin-top: 5px; display: flex; align-items: center; gap: 4px;
  }

  /* Tips sidebar */
  .np-tips {
    background: linear-gradient(135deg, #fafafa, #f8fafc);
    border: 1px solid #e2e8f0; border-radius: 18px;
    padding: 22px; margin-top: 20px;
    animation: fadeUp 0.5s 0.2s ease both;
  }
`

const Icon = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  back:     'M19 12H5M12 5l-7 7 7 7',
  title:    'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  desc:     'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
  budget:   'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6m0 4h.01',
  skills:   'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M6.343 6.343l-.707-.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  check:    'M20 6 9 17l-5-5',
  arrow:    'M5 12h14M12 5l7 7-7 7',
  rupee:    'M6 3h12M6 8h12M9 3v18M9 8c3.33 0 6 .67 6 4s-3.33 4.33-6 4.33',
  lightbulb:'M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6.002 6.002 0 0 1 6 9a6 6 0 0 1 6-6z',
  tag:      'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
}

const MAX_DESC = 500

const NewProject = () => {
  const navigate  = useNavigate()
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [budget,      setBudget]      = useState('')
  const [tags,        setTags]        = useState([])
  const [tagInput,    setTagInput]    = useState('')
  const [loading,     setLoading]     = useState(false)
  const [errors,      setErrors]      = useState({})

  const username = localStorage.getItem('username') || 'Client'

  /* ── Tag handling ── */
  const addTag = (val) => {
    const trimmed = val.trim().replace(/,/g, '')
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags(prev => [...prev, trimmed])
    }
    setTagInput('')
  }

  const handleTagKey = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t))

  /* ── Validation ── */
  const validate = () => {
    const e = {}
    if (!title.trim())                  e.title       = 'Project title is required'
    if (!description.trim())            e.description = 'Description is required'
    if (!budget || Number(budget) <= 0) e.budget      = 'Please enter a valid budget'
    if (tags.length === 0)              e.skills      = 'Add at least one required skill'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const payload = {
      title: title.trim(),
      description: description.trim(),
      budget,
      skills: tags.join(','),
      clientId:    localStorage.getItem('userId'),
      clientName:  localStorage.getItem('username'),
      clientEmail: localStorage.getItem('email'),
    }
    try {
      await api.post('/project/create', payload)
      navigate('/client')
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Project creation failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const descLen   = description.length
  const descClass = descLen > MAX_DESC * 0.9 ? (descLen >= MAX_DESC ? 'limit' : 'warn') : ''
  const filled    = [!!title, !!description, !!budget, tags.length > 0].filter(Boolean).length
  const progress  = Math.round((filled / 4) * 100)

  return (
    <div className="np np-page">
      <style>{S}</style>
      <div className="np-blob1"/><div className="np-blob2"/>

      {/* ── NAVBAR ── */}
      <nav className="np-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span onClick={() => navigate('/')}
            style={{ fontSize: 20, fontWeight: 800, color: '#2563eb',
              cursor: 'pointer', letterSpacing: '-0.5px' }}>
            SB Works
          </span>
          <span style={{ color: '#e2e8f0', fontSize: 18 }}>›</span>
          <span onClick={() => navigate('/client')}
            style={{ fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            Client
          </span>
          <span style={{ color: '#e2e8f0', fontSize: 18 }}>›</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#2563eb' }}>Post Project</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8,
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: 12, padding: '7px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 12 }}>
            {username[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{username}</span>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="np-content">

        {/* Back + progress */}
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 28,
          animation: 'fadeUp 0.4s ease both' }}>
          <button className="np-back" onClick={() => navigate('/client')}>
            <Icon d={icons.back} size={15} color="#64748b"/>
            Back to Projects
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
              {filled}/4 fields
            </div>
            <div style={{ width: 100, height: 6, background: '#e2e8f0',
              borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 100, transition: 'width 0.4s ease',
                width: `${progress}%`,
                background: progress === 100
                  ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                  : 'linear-gradient(90deg, #2563eb, #7c3aed)' }}/>
            </div>
            {progress === 100 && (
              <div style={{ width: 20, height: 20, borderRadius: '50%',
                background: '#dcfce7', display: 'flex', alignItems: 'center',
                justifyContent: 'center' }}>
                <Icon d={icons.check} size={11} color="#16a34a"/>
              </div>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="np-card">

          {/* Card header */}
          <div className="np-card-header">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.15)', color: 'white',
                fontSize: 11, fontWeight: 700, padding: '4px 12px',
                borderRadius: 100, border: '1px solid rgba(255,255,255,0.25)',
                marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                📋 New Project
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white',
                letterSpacing: '-0.5px', margin: '0 0 8px' }}>
                Post a Project
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.6 }}>
                Fill in the details below and connect with the right freelancer for your work.
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="np-card-body">
            <form onSubmit={handleSubmit}>

              {/* Title */}
              <div className="np-field">
                <label className="np-label">
                  <span className="np-label-icon" style={{ background: '#eff6ff' }}>✏️</span>
                  Project Title
                  <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                </label>
                <input
                  type="text" className={`np-input${errors.title ? ' error' : ''}`}
                  placeholder="e.g. Build a React e-commerce website"
                  value={title} maxLength={100}
                  onChange={e => { setTitle(e.target.value); setErrors(p => ({...p, title: ''})) }}
                />
                {errors.title
                  ? <div className="np-error">⚠ {errors.title}</div>
                  : <div className="np-hint">
                      <Icon d={icons.lightbulb} size={11} color="#94a3b8"/>
                      Be specific — clear titles attract better proposals
                    </div>
                }
              </div>

              {/* Description */}
              <div className="np-field">
                <label className="np-label">
                  <span className="np-label-icon" style={{ background: '#f0fdf4' }}>📄</span>
                  Project Description
                  <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                </label>
                <textarea
                  rows={5} className={`np-textarea${errors.description ? ' error' : ''}`}
                  placeholder="Describe what you need, goals, deliverables, timeline expectations..."
                  value={description} maxLength={MAX_DESC}
                  onChange={e => { setDescription(e.target.value); setErrors(p => ({...p, description: ''})) }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {errors.description
                    ? <div className="np-error">⚠ {errors.description}</div>
                    : <div className="np-hint">
                        <Icon d={icons.lightbulb} size={11} color="#94a3b8"/>
                        Include deliverables, timeline, and any tech preferences
                      </div>
                  }
                  <div className={`np-char ${descClass}`}>{descLen}/{MAX_DESC}</div>
                </div>
              </div>

              {/* Budget */}
              <div className="np-field">
                <label className="np-label">
                  <span className="np-label-icon" style={{ background: '#fef9f0' }}>💰</span>
                  Budget
                  <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                </label>
                <div className="np-budget-wrap">
                  <span className="np-budget-prefix">₹</span>
                  <input
                    type="number" min="0"
                    className={`np-input np-budget-input${errors.budget ? ' error' : ''}`}
                    placeholder="50000"
                    value={budget}
                    onChange={e => { setBudget(e.target.value); setErrors(p => ({...p, budget: ''})) }}
                  />
                </div>
                {errors.budget
                  ? <div className="np-error">⚠ {errors.budget}</div>
                  : budget && Number(budget) > 0
                  ? <div className="np-budget-preview">
                      <Icon d={icons.check} size={14} color="#16a34a"/>
                      Budget set to ₹{Number(budget).toLocaleString('en-IN')}
                    </div>
                  : <div className="np-hint">
                      <Icon d={icons.lightbulb} size={11} color="#94a3b8"/>
                      Set a realistic budget to attract quality proposals
                    </div>
                }
              </div>

              {/* Skills */}
              <div className="np-field">
                <label className="np-label">
                  <span className="np-label-icon" style={{ background: '#fdf4ff' }}>🛠️</span>
                  Required Skills
                  <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                </label>
                <div className={`np-tags-wrap${errors.skills ? ' error' : ''}`}
                  style={errors.skills ? { borderColor: '#fca5a5', background: '#fff5f5' } : {}}
                  onClick={() => document.getElementById('np-tag-input')?.focus()}>
                  {tags.map(t => (
                    <span key={t} className="np-tag">
                      {t}
                      <button type="button" className="np-tag-remove" onClick={(e) => { e.stopPropagation(); removeTag(t) }}>×</button>
                    </span>
                  ))}
                  <input
                    id="np-tag-input"
                    className="np-tag-input"
                    placeholder={tags.length === 0 ? 'React, Node.js, MongoDB… (press comma or Enter)' : 'Add more…'}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                    onBlur={() => tagInput && addTag(tagInput)}
                  />
                </div>
                {errors.skills
                  ? <div className="np-error">⚠ {errors.skills}</div>
                  : <div className="np-hint">
                      <Icon d={icons.tag} size={11} color="#94a3b8"/>
                      Press comma or Enter to add a skill · max 10
                    </div>
                }
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 12, padding: '12px 16px', marginBottom: 16,
                  fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                  ⚠ {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="np-submit" disabled={loading}>
                {loading
                  ? <><div className="np-spinner"/> Publishing Project…</>
                  : <><span>Publish Project</span><Icon d={icons.arrow} size={17} color="white"/></>
                }
              </button>

            </form>
          </div>
        </div>

        {/* Tips */}
        <div className="np-tips">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              Tips for a great project post
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              'Write a clear, specific title',
              'Describe deliverables, not just goals',
              'Set a realistic budget range',
              'List the exact tech stack you need',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start',
                gap: 8, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%',
                  background: '#eff6ff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Icon d={icons.check} size={10} color="#2563eb"/>
                </div>
                {tip}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default NewProject