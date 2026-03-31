import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Admin = () => {
  const navigate = useNavigate();
  const [projectsCount, setProjectsCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, applicationsRes, usersRes] = await Promise.all([
        api.get("/project"),
        api.get("/application"),
        api.get("/user"),
      ]);
      setProjectsCount(projectsRes.data.length);
      setCompletedCount(
        projectsRes.data.filter((p) => p.status === "Completed").length
      );
      setApplicationsCount(applicationsRes.data.length);
      setUsersCount(usersRes.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const cards = [
    {
      title: "All Projects",
      value: projectsCount,
      route: "/admin-projects",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
      accent: "#6c63ff",
      accentBg: "rgba(108,99,255,0.12)",
      glow: "rgba(108,99,255,0.15)",
      label: "Total in system",
    },
    {
      title: "Completed",
      value: completedCount,
      route: "/admin-projects",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
      accent: "#43d9ad",
      accentBg: "rgba(67,217,173,0.12)",
      glow: "rgba(67,217,173,0.15)",
      label: "Projects finished",
    },
    {
      title: "Applications",
      value: applicationsCount,
      route: "/admin-applications",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="12" y2="17" />
        </svg>
      ),
      accent: "#f5a623",
      accentBg: "rgba(245,166,35,0.12)",
      glow: "rgba(245,166,35,0.15)",
      label: "Submitted forms",
    },
    {
      title: "Users",
      value: usersCount,
      route: "/all-users",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      accent: "#ff6584",
      accentBg: "rgba(255,101,132,0.12)",
      glow: "rgba(255,101,132,0.15)",
      label: "Registered accounts",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-wrap {
          min-height: 100vh;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          color: #f0f0f8;
          padding: 36px 32px;
        }

        .admin-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        .admin-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #f0f0f8;
          line-height: 1.1;
        }

        .admin-sub {
          font-size: 13px;
          color: #8585a0;
          margin-top: 5px;
        }

        .admin-date {
          font-size: 13px;
          color: #8585a0;
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 10px;
          padding: 8px 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          .admin-wrap { padding: 20px 16px; }
        }

        .stat-card {
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 18px;
          padding: 22px;
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--card-accent-color);
          box-shadow: 0 12px 40px var(--card-glow);
        }

        .stat-card::after {
          content: '';
          position: absolute;
          right: -24px;
          bottom: -24px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--card-accent-color);
          opacity: 0.06;
          pointer-events: none;
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-accent-bg);
          color: var(--card-accent-color);
        }

        .card-arrow {
          color: #3e3e55;
          font-size: 18px;
          transition: color 0.15s, transform 0.15s;
        }

        .stat-card:hover .card-arrow {
          color: var(--card-accent-color);
          transform: translate(2px, -2px);
        }

        .card-value {
          font-family: 'Syne', sans-serif;
          font-size: 38px;
          font-weight: 700;
          color: #f0f0f8;
          line-height: 1;
          margin-bottom: 6px;
          transition: opacity 0.3s;
        }

        .card-value.loading {
          opacity: 0.3;
        }

        .card-title {
          font-size: 15px;
          font-weight: 500;
          color: #c8c8e0;
          margin-bottom: 3px;
        }

        .card-label {
          font-size: 12px;
          color: #8585a0;
        }

        .divider-bar {
          height: 2px;
          border-radius: 2px;
          background: var(--card-accent-bg);
          margin-top: 16px;
          position: relative;
          overflow: hidden;
        }

        .divider-fill {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 40%;
          background: var(--card-accent-color);
          border-radius: 2px;
          opacity: 0.7;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: #f0f0f8;
        }

        .section-link {
          font-size: 13px;
          color: #6c63ff;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
        }

        .section-link:hover { text-decoration: underline; }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 500px) {
          .quick-actions { grid-template-columns: 1fr; }
        }

        .action-btn {
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .action-btn:hover {
          background: #1e1e26;
          border-color: #3e3e55;
        }

        .action-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .action-text { font-size: 14px; font-weight: 500; color: #c8c8e0; }
        .action-sub { font-size: 12px; color: #8585a0; margin-top: 1px; }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 11px;
          background: rgba(255,101,132,0.08);
          border: 1px solid rgba(255,101,132,0.25);
          color: #ff6584;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .logout-btn:hover {
          background: rgba(255,101,132,0.15);
          border-color: rgba(255,101,132,0.5);
          transform: translateY(-1px);
        }
        .logout-btn:active { transform: scale(0.97); }

        /* Modal overlay */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
          animation: fadeIn .15s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal-box {
          background: #17171d;
          border: 1px solid #2e2e3a;
          border-radius: 20px;
          padding: 32px 28px;
          width: 100%;
          max-width: 360px;
          text-align: center;
          animation: slideUp .18s ease;
        }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        .modal-icon {
          width: 52px; height: 52px; border-radius: 16px;
          background: rgba(255,101,132,0.12);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: #ff6584;
        }
        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700; color: #f0f0f8;
          margin-bottom: 8px;
        }
        .modal-sub { font-size: 13px; color: #8585a0; margin-bottom: 24px; line-height: 1.5; }
        .modal-actions { display: flex; gap: 10px; }
        .modal-cancel {
          flex: 1; padding: 11px;
          background: #1e1e26; border: 1px solid #2e2e3a;
          border-radius: 11px; color: #c8c8e0;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 500; cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .modal-cancel:hover { background: #25252f; border-color: #3e3e55; }
        .modal-confirm {
          flex: 1; padding: 11px;
          background: rgba(255,101,132,0.12); border: 1px solid rgba(255,101,132,0.3);
          border-radius: 11px; color: #ff6584;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 500; cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .modal-confirm:hover { background: rgba(255,101,132,0.22); border-color: rgba(255,101,132,0.55); }
      `}</style>

      <div className="admin-wrap">
        <div className="admin-header">
          <div>
            <div className="admin-title">Admin Dashboard</div>
            <div className="admin-sub">Overview of your platform activity</div>
          </div>
          <div className="admin-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric",
            })}
          </div>
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>

        <div className="stats-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="stat-card"
              style={{
                "--card-accent-color": card.accent,
                "--card-accent-bg": card.accentBg,
                "--card-glow": card.glow,
              }}
              onClick={() => navigate(card.route)}
            >
              <div className="card-top">
                <div className="card-icon">{card.icon}</div>
                <span className="card-arrow">↗</span>
              </div>
              <div className={`card-value${loading ? " loading" : ""}`}>
                {loading ? "—" : card.value}
              </div>
              <div className="card-title">{card.title}</div>
              <div className="card-label">{card.label}</div>
              <div className="divider-bar">
                <div className="divider-fill" />
              </div>
            </div>
          ))}
        </div>

        <div className="section-header">
          <div className="section-title">Quick Actions</div>
        </div>

        <div className="quick-actions">
          {[
            { icon: "📁", bg: "rgba(108,99,255,0.12)", color: "#6c63ff", label: "Manage Projects", sub: "View, edit or remove projects", route: "/admin-projects" },
            { icon: "📋", bg: "rgba(245,166,35,0.12)", color: "#f5a623", label: "Review Applications", sub: "Approve or reject submissions", route: "/admin-applications" },
            { icon: "👥", bg: "rgba(255,101,132,0.12)", color: "#ff6584", label: "All Users", sub: "Browse registered accounts", route: "/all-users" },
            { icon: "✅", bg: "rgba(67,217,173,0.12)", color: "#43d9ad", label: "Completed Projects", sub: "Archive of finished work", route: "/admin-projects" },
          ].map((a) => (
            <button key={a.label} className="action-btn" onClick={() => navigate(a.route)}>
              <div className="action-icon" style={{ background: a.bg, color: a.color }}>
                {a.icon}
              </div>
              <div>
                <div className="action-text">{a.label}</div>
                <div className="action-sub">{a.sub}</div>
              </div>
            </button>
          ))}
        </div>

        {showLogoutModal && (
          <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <div className="modal-title">Sign out?</div>
              <div className="modal-sub">You'll be redirected to the login page and your session will end.</div>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button className="modal-confirm" onClick={handleLogout}>Yes, sign out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;