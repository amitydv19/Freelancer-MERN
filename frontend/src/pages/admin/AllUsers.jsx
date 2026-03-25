import { useEffect, useState } from 'react'
import api from '../../services/api'

const roleMeta = {
  admin:      { color: '#ff6584', bg: 'rgba(255,101,132,0.12)' },
  freelancer: { color: '#6c63ff', bg: 'rgba(108,99,255,0.12)'  },
  client:     { color: '#43d9ad', bg: 'rgba(67,217,173,0.12)'  },
}
const getRole = (r) => roleMeta[r?.toLowerCase()] || { color: '#8585a0', bg: 'rgba(133,133,160,0.12)' }

const initials = (name) =>
  name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?'

const avatarColors = ['#6c63ff','#43d9ad','#ff6584','#f5a623','#3b9eff']
const avatarColor  = (str) => avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length]

const ROLES = ['All', 'Admin', 'Freelancer', 'Client']

const AllUsers = () => {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [view, setView]             = useState('table') // 'table' | 'grid'

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const { data } = await api.get('/user')
        if (isMounted) setUsers([...data].reverse())
      } catch (err) { console.error(err) }
      finally { if (isMounted) setLoading(false) }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const displayed = users
    .filter(u => roleFilter === 'All' || u.usertype?.toLowerCase() === roleFilter.toLowerCase())
    .filter(u =>
      search === '' ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    )

  const counts = ROLES.reduce((acc, r) => {
    acc[r] = r === 'All' ? users.length : users.filter(u => u.usertype?.toLowerCase() === r.toLowerCase()).length
    return acc
  }, {})

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .au-wrap {
          min-height: 100vh; background: #0f0f13;
          font-family: 'DM Sans', sans-serif; color: #f0f0f8;
          padding: 32px 28px;
        }

        .au-topbar {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap;
          gap: 16px; margin-bottom: 24px;
        }
        .au-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; }
        .au-sub   { font-size: 13px; color: #8585a0; margin-top: 4px; }

        .au-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .au-search {
          display: flex; align-items: center; gap: 8px;
          background: #17171d; border: 1px solid #2e2e3a;
          border-radius: 12px; padding: 9px 14px;
        }
        .au-search svg { color: #8585a0; flex-shrink: 0; }
        .au-search input {
          background: none; border: none; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: #f0f0f8; width: 200px;
        }
        .au-search input::placeholder { color: #8585a0; }

        .au-view-toggle {
          display: flex; background: #17171d;
          border: 1px solid #2e2e3a; border-radius: 10px; overflow: hidden;
        }
        .au-view-btn {
          padding: 8px 12px; cursor: pointer; border: none;
          background: none; color: #8585a0; display: flex;
          align-items: center; transition: all .15s;
        }
        .au-view-btn.active { background: rgba(108,99,255,.15); color: #6c63ff; }

        .au-tabs {
          display: flex; gap: 6px; margin-bottom: 22px; flex-wrap: wrap;
        }
        .au-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 20px; font-size: 13px;
          font-weight: 500; cursor: pointer; border: 1px solid #2e2e3a;
          background: #17171d; color: #8585a0; transition: all .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .au-tab:hover { border-color: #3e3e55; color: #c8c8e0; }
        .au-tab.active { background: rgba(108,99,255,.15); border-color: #6c63ff; color: #6c63ff; }
        .au-tab-count {
          font-size: 11px; font-weight: 600;
          background: rgba(255,255,255,.08); padding: 1px 6px;
          border-radius: 20px; min-width: 20px; text-align: center;
        }
        .au-tab.active .au-tab-count { background: rgba(108,99,255,.25); }

        .au-count { font-size: 13px; color: #8585a0; margin-bottom: 14px; }

        /* ── TABLE VIEW ── */
        .au-table-wrap {
          background: #17171d; border: 1px solid #2e2e3a;
          border-radius: 16px; overflow: hidden;
        }
        .au-table { width: 100%; border-collapse: collapse; }
        .au-table thead tr {
          background: #1e1e26; border-bottom: 1px solid #2e2e3a;
        }
        .au-table th {
          padding: 12px 18px; text-align: left; font-size: 11px;
          font-weight: 600; text-transform: uppercase; letter-spacing: .07em;
          color: #8585a0;
        }
        .au-table tbody tr {
          border-bottom: 1px solid #2e2e3a; transition: background .12s;
        }
        .au-table tbody tr:last-child { border-bottom: none; }
        .au-table tbody tr:hover { background: #1e1e26; }
        .au-table td { padding: 13px 18px; font-size: 14px; color: #c8c8e0; }

        .au-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; flex-shrink: 0;
        }
        .au-user-cell { display: flex; align-items: center; gap: 10px; }
        .au-username { font-weight: 500; color: #f0f0f8; }
        .au-role-badge {
          font-size: 11px; font-weight: 600; padding: 3px 10px;
          border-radius: 20px; display: inline-block;
        }
        .au-email { color: #8585a0; font-size: 13px; }

        /* ── GRID VIEW ── */
        .au-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }
        .au-user-card {
          background: #17171d; border: 1px solid #2e2e3a;
          border-radius: 16px; padding: 20px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 10px;
          transition: transform .16s, border-color .16s, box-shadow .16s;
        }
        .au-user-card:hover {
          transform: translateY(-2px); border-color: #3e3e55;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
        }
        .au-avatar-lg {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 600;
        }
        .au-card-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:600; color:#f0f0f8; }
        .au-card-email { font-size:12px; color:#8585a0; word-break:break-all; }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg,#17171d 25%,#1e1e26 50%,#17171d 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .au-empty { text-align:center; padding:60px 20px; color:#8585a0; }
        .au-empty-icon { font-size:36px; margin-bottom:12px; opacity:.5; }
        .au-empty-title { font-size:16px; color:#c8c8e0; margin-bottom:6px; }

        @media (max-width:768px) {
          .au-wrap { padding:20px 16px; }
          .au-search input { width:150px; }
          .au-table th:nth-child(3), .au-table td:nth-child(3) { display:none; }
        }
      `}</style>

      <div className="au-wrap">
        <div className="au-topbar">
          <div>
            <div className="au-title">All Users</div>
            <div className="au-sub">Manage everyone registered on the platform</div>
          </div>
          <div className="au-controls">
            <div className="au-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="au-view-toggle">
              <button className={`au-view-btn${view==='table'?' active':''}`} onClick={() => setView('table')} title="Table view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/>
                </svg>
              </button>
              <button className={`au-view-btn${view==='grid'?' active':''}`} onClick={() => setView('grid')} title="Grid view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="au-tabs">
          {ROLES.map(r => (
            <button
              key={r}
              className={`au-tab${roleFilter===r?' active':''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r}
              <span className="au-tab-count">{counts[r]||0}</span>
            </button>
          ))}
        </div>

        {!loading && <div className="au-count">{displayed.length} user{displayed.length!==1?'s':''}</div>}

        {loading ? (
          <div className="au-table-wrap">
            <table className="au-table">
              <thead><tr>
                <th>User</th><th>Email</th><th>Role</th>
              </tr></thead>
              <tbody>
                {[1,2,3,4,5].map(i => (
                  <tr key={i}>
                    <td><div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="skeleton" style={{width:32,height:32,borderRadius:10,flexShrink:0}}/>
                      <div className="skeleton" style={{height:14,width:100}}/>
                    </div></td>
                    <td><div className="skeleton" style={{height:13,width:160}}/></td>
                    <td><div className="skeleton" style={{height:22,width:70,borderRadius:20}}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : displayed.length === 0 ? (
          <div className="au-empty">
            <div className="au-empty-icon">👥</div>
            <div className="au-empty-title">No users found</div>
            <div>Try a different filter or search term</div>
          </div>
        ) : view === 'table' ? (
          <div className="au-table-wrap">
            <table className="au-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(user => {
                  const role = getRole(user.usertype)
                  const color = avatarColor(user.username)
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="au-user-cell">
                          <div
                            className="au-avatar"
                            style={{ background: color + '22', color }}
                          >
                            {initials(user.username)}
                          </div>
                          <span className="au-username">{user.username}</span>
                        </div>
                      </td>
                      <td className="au-email">{user.email}</td>
                      <td>
                        <span
                          className="au-role-badge"
                          style={{ background: role.bg, color: role.color }}
                        >
                          {user.usertype}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="au-grid">
            {displayed.map(user => {
              const role  = getRole(user.usertype)
              const color = avatarColor(user.username)
              return (
                <div key={user._id} className="au-user-card">
                  <div
                    className="au-avatar-lg"
                    style={{ background: color + '22', color }}
                  >
                    {initials(user.username)}
                  </div>
                  <div className="au-card-name">{user.username}</div>
                  <div className="au-card-email">{user.email}</div>
                  <span
                    className="au-role-badge"
                    style={{ background: role.bg, color: role.color }}
                  >
                    {user.usertype}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default AllUsers