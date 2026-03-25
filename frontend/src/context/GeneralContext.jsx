import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export const GeneralContext = createContext()

/* ── Toast Styles ─────────────────────────────────────── */
const toastStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

  @keyframes toastSlideIn {
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes toastSlideOut {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(110%); opacity: 0; }
  }
  @keyframes toastProgress {
    from { width: 100%; }
    to   { width: 0%; }
  }

  .toast-wrap {
    position: fixed; top: 24px; right: 24px; z-index: 99999;
    display: flex; flex-direction: column; gap: 10px;
    pointer-events: none;
  }
  .toast {
    pointer-events: all;
    min-width: 320px; max-width: 380px;
    background: white; border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.14), 0 2px 10px rgba(0,0,0,0.08);
    overflow: hidden; font-family: 'Plus Jakarta Sans', sans-serif;
    animation: toastSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .toast.hide {
    animation: toastSlideOut 0.3s ease both;
  }
  .toast-body {
    display: flex; align-items: flex-start; gap: 12px; padding: 16px 16px 12px;
  }
  .toast-icon {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .toast-title {
    font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 3px;
  }
  .toast-msg {
    font-size: 13px; color: #64748b; line-height: 1.45;
  }
  .toast-close {
    margin-left: auto; background: none; border: none; cursor: pointer;
    color: #94a3b8; font-size: 18px; padding: 0; line-height: 1;
    flex-shrink: 0; transition: color 0.2s;
  }
  .toast-close:hover { color: #0f172a; }
  .toast-bar {
    height: 3px; border-radius: 0 0 16px 16px;
    animation: toastProgress 4s linear forwards;
  }
`

/* ── Toast Component ──────────────────────────────────── */
const Toast = ({ toasts, removeToast }) => (
  <>
    <style>{toastStyles}</style>
    <div className="toast-wrap">
      {toasts.map(({ id, type, title, message, hiding }) => {
        const styles = {
          error:   { bg: '#fef2f2', iconBg: '#fee2e2', color: '#ef4444', bar: '#ef4444', icon: '❌' },
          success: { bg: '#f0fdf4', iconBg: '#dcfce7', color: '#22c55e', bar: '#22c55e', icon: '✅' },
          warning: { bg: '#fffbeb', iconBg: '#fef3c7', color: '#f59e0b', bar: '#f59e0b', icon: '⚠️' },
        }
        const s = styles[type] || styles.error
        return (
          <div key={id} className={`toast${hiding ? ' hide' : ''}`}
            style={{ background: s.bg }}>
            <div className="toast-body">
              <div className="toast-icon" style={{ background: s.iconBg }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="toast-title">{title}</div>
                <div className="toast-msg">{message}</div>
              </div>
              <button className="toast-close" onClick={() => removeToast(id)}>×</button>
            </div>
            <div className="toast-bar" style={{ background: s.bar }} />
          </div>
        )
      })}
    </div>
  </>
)

/* ── Context Provider ─────────────────────────────────── */
const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [usertype, setUsertype] = useState('')

  // Toast state
  const [toasts, setToasts] = useState([])

  const showToast = (type, title, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message, hiding: false }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t))
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
    }, 4000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
  }

  // ── LOGIN ──
  const login = async () => {
  try {
    const { data } = await api.post('/auth/login', { email, password })

    if (!data || !data.token) {
      showToast('error', 'Login failed', 'Invalid response from server.')
      return false
    }

    localStorage.setItem('userId',   data._id)
    localStorage.setItem('usertype', data.usertype)
    localStorage.setItem('username', data.username)
    localStorage.setItem('email',    data.email)
    localStorage.setItem('token',    data.token)

    showToast('success', 'Welcome back!', `Signed in as ${data.username}`)
    setTimeout(() => navigate(`/${data.usertype}`), 800)
    return true

  } catch (error) {
  const msg = error?.response?.data?.msg || error?.response?.data?.error || ''

  if (msg.includes('duplicate') || msg.includes('E11000')) {
    showToast('error', 'Email already exists', 'An account with this email already exists. Try logging in.')
  } else if (error?.response?.status === 409) {
    showToast('error', 'Email already exists', 'An account with this email already exists. Try logging in.')
  } else if (error?.response?.status === 400 && msg === 'User already exists') {
    showToast('error', 'Email already exists', 'An account with this email already exists. Try logging in.')
  } else {
    // Temporarily show the actual error so we can debug
    showToast('error', 'Registration failed', msg || 'Something went wrong. Please try again.')
  }

  console.error('Register error:', error)
}
}
  // ── REGISTER ──
  const register = async () => {
    // ✅ Frontend validation before hitting the API
    if (!username || !email || !password || !usertype) {
      showToast('warning', 'Missing fields', 'Please fill in all fields and select a role.')
      return
    }

    try {
      const { data } = await api.post('/auth/register', { username, email, password, usertype })

      localStorage.setItem('userId',   data._id)
      localStorage.setItem('usertype', data.usertype)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email',    data.email)
      localStorage.setItem('token',    data.token)

      showToast('success', 'Account created!', `Welcome to SB Works, ${data.username}!`)
      setTimeout(() => navigate(`/${data.usertype}`), 800)

    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.msg || ''

      if (msg.includes('duplicate') || msg.includes('E11000')) {
        showToast('error', 'Email already exists', 'An account with this email already exists. Try logging in.')
      } else if (error?.response?.status === 409) {
        showToast('error', 'Email already exists', 'An account with this email already exists. Try logging in.')
      } else {
        showToast('error', 'Registration failed', 'Something went wrong. Please try again.')
      }

      console.error('Register error:', error)
    }
  }

  // ── LOGOUT ──
  const logout = () => {
    localStorage.clear()
    showToast('success', 'Signed out', 'You have been logged out successfully.')
    setTimeout(() => navigate('/'), 600)
  }

  return (
    <GeneralContext.Provider value={{
      login, register, logout,
      username, setUsername,
      email,    setEmail,
      password, setPassword,
      usertype, setUsertype,
    }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider