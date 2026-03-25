import { useEffect, useState } from 'react'
import api from '../../services/api'

const statusMeta = {
  Pending:  { color: '#f5a623', bg: 'rgba(245,166,35,0.12)'  },
  Accepted: { color: '#43d9ad', bg: 'rgba(67,217,173,0.12)'  },
  Rejected: { color: '#ff6584', bg: 'rgba(255,101,132,0.12)' },
  Reviewing:{ color: '#6c63ff', bg: 'rgba(108,99,255,0.12)'  },
}
const getStatus = (s) => statusMeta[s] || { color: '#8585a0', bg: 'rgba(133,133,160,0.12)' }

const TABS = ['All', 'Pending', 'Reviewing', 'Accepted', 'Rejected']

const AllApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [activeTab, setActiveTab]       = useState('All')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const { data } = await api.get('/application')
        if (isMounted) setApplications([...data].reverse())
      } catch (err) { console.error(err) }
      finally { if (isMounted) setLoading(false) }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const displayed = applications
    .filter(a => activeTab === 'All' || a.status === activeTab)
    .filter(a =>
      search === '' ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
    )

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'All' ? applications.length : applications.filter(a => a.status === t).length
    return acc
  }, {})

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .aa-wrap {
          min-height: 100vh;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          color: #f0f0f8;
          padding: 32px 28px;
        }

        .aa-topbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .aa-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; }
        .aa-sub   { font-size: 13px; color: #8585a0; margin-top: 4px; }

        .aa-search {
          display: flex; align-items: center; gap: 8px;
          background: #17171d; border: 1px solid #2e2e3a;
          border-radius: 12px; padding: 9px 14px;
        }
        .aa-search svg { color: #8585a0; flex-shrink: 0; }
        .aa-search input {
          background: none; border: none; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: #f0f0f8; width: 220px;
        }
        .aa-search input::placeholder { color: #8585a0; }

        .aa-tabs {
          display: flex; gap: 6px; margin-bottom: 22px; flex-wrap: wrap;
        }
        .aa-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 20px; font-size: 13px;
          font-weight: 500; cursor: pointer; border: 1px solid #2e2e3a;
          background: #17171d; color: #8585a0; transition: all .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .aa-tab:hover { border-color: #3e3e55; color: #c8c8e0; }
        .aa-tab.active { background: rgba(108,99,255,.15); border-color: #6c63ff; color: #6c63ff; }
        .aa-tab-count {
          font-size: 11px; font-weight: 600;
          background: rgba(255,255,255,.08); padding: 1px 6px;
          border-radius: 20px; min-width: 20px; text-align: center;
        }
        .aa-tab.active .aa-tab-count { background: rgba(108,99,255,.25); }

        .aa-count { font-size: 13px; color: #8585a0; margin-bottom: 14px; }

        .aa-list { display: flex; flex-direction: column; gap: 14px; }

        .aa-card {
          background: #17171d; border: 1px solid #2e2e3a;
          border-radius: 16px; padding: 20px 22px;
          transition: transform .16s, border-color .16s, box-shadow .16s;
        }
        .aa-card:hover {
          transform: translateY(-2px); border-color: #3e3e55;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
        }

        .aa-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px; margin-bottom: 10px;
        }
        .aa-card-title {
          font-family: 'Syne', sans-serif; font-size: 16px;
          font-weight: 600; color: #f0f0f8; line-height: 1.3;
        }
        .aa-status {
          font-size: 11px; font-weight: 600; padding: 4px 11px;
          border-radius: 20px; white-space: nowrap; flex-shrink: 0;
        }
        .aa-desc {
          font-size: 13px; color: #8585a0; line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        .aa-meta {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }
        .aa-meta-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .aa-chip {
          display: flex; align-items: center; gap: 6px;
          background: #1e1e26; border: 1px solid #2e2e3a;
          border-radius: 10px; padding: 6px 12px;
          font-size: 12px; color: #c8c8e0;
        }
        .aa-chip svg { color: #8585a0; }

        .aa-bid {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 500; color: #43d9ad;
        }
        .aa-bid-icon {
          width: 24px; height: 24px; border-radius: 7px;
          background: rgba(67,217,173,.12); display: flex;
          align-items: center; justify-content: center; font-size: 12px;
        }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg,#17171d 25%,#1e1e26 50%,#17171d 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 10px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skel-card {
          background: #17171d; border: 1px solid #2e2e3a;
          border-radius: 16px; padding: 20px 22px;
        }

        .aa-empty { text-align: center; padding: 60px 20px; color: #8585a0; }
        .aa-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .5; }
        .aa-empty-title { font-size: 16px; color: #c8c8e0; margin-bottom: 6px; }

        @media (max-width: 600px) {
          .aa-wrap { padding: 20px 16px; }
          .aa-search input { width: 150px; }
        }
      `}</style>

      <div className="aa-wrap">
        <div className="aa-topbar">
          <div>
            <div className="aa-title">All Applications</div>
            <div className="aa-sub">Track and manage every submitted application</div>
          </div>
          <div className="aa-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search applications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="aa-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`aa-tab${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
              <span className="aa-tab-count">{counts[t] || 0}</span>
            </button>
          ))}
        </div>

        {!loading && <div className="aa-count">{displayed.length} application{displayed.length !== 1 ? 's' : ''}</div>}

        <div className="aa-list">
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="skel-card">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <div className="skeleton" style={{ height:18, width:'45%' }}/>
                  <div className="skeleton" style={{ height:22, width:80, borderRadius:20 }}/>
                </div>
                <div className="skeleton" style={{ height:13, width:'90%', marginBottom:6 }}/>
                <div className="skeleton" style={{ height:13, width:'65%', marginBottom:16 }}/>
                <div style={{ display:'flex', gap:8 }}>
                  <div className="skeleton" style={{ height:30, width:120, borderRadius:10 }}/>
                  <div className="skeleton" style={{ height:30, width:90, borderRadius:10 }}/>
                </div>
              </div>
            ))
          ) : displayed.length === 0 ? (
            <div className="aa-empty">
              <div className="aa-empty-icon">📋</div>
              <div className="aa-empty-title">No applications found</div>
              <div>Try a different tab or search term</div>
            </div>
          ) : (
            displayed.map(app => {
              const st = getStatus(app.status)
              return (
                <div key={app._id} className="aa-card">
                  <div className="aa-card-top">
                    <div className="aa-card-title">{app.title}</div>
                    <span className="aa-status" style={{ background: st.bg, color: st.color }}>
                      {app.status}
                    </span>
                  </div>
                  <p className="aa-desc">{app.description}</p>
                  <div className="aa-meta">
                    <div className="aa-meta-left">
                      <div className="aa-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        {app.clientName}
                      </div>
                      {app.freelancerName && (
                        <div className="aa-chip">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                          </svg>
                          {app.freelancerName}
                        </div>
                      )}
                    </div>
                    <div className="aa-bid">
                      <div className="aa-bid-icon">₹</div>
                      {Number(app.bidAmount).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

export default AllApplications