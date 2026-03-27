import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="dash-header">
      <div className="header-left">
        <div className="system-badge">
          <span className="badge-dot"></span>
          <span className="badge-label">SYSTEM ONLINE</span>
        </div>
        <div className="header-title-block">
          <h1 className="header-title">
            <span className="title-icon">⬡</span>
            PedSafe<span className="title-accent">ML</span>
          </h1>
          <p className="header-subtitle">Pedestrian Detection Crosswalk Safety System</p>
        </div>
      </div>

      {/* Navigation — only shown when logged in */}
      {user && (
        <nav className="header-nav">
          <button
            className={`nav-btn ${isActive("/dashboard") ? "nav-btn-active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">◉</span> Dashboard
          </button>
          <button
            className={`nav-btn ${isActive("/settings") ? "nav-btn-active" : ""}`}
            onClick={() => navigate("/settings")}
          >
            <span className="nav-icon">⚙</span> Settings
          </button>
        </nav>
      )}

      <div className="header-right">
        <div className="header-meta">
          <div className="meta-item">
            <span className="meta-label">DATE</span>
            <span className="meta-value">
              {currentTime.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="meta-divider" />
          <div className="meta-item">
            <span className="meta-label">LOCAL TIME</span>
            <span className="meta-value mono">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </span>
          </div>
          <div className="meta-divider" />
          <div className="meta-item">
            <span className="meta-label">ZONE</span>
            <span className="meta-value">CROSSWALK-01</span>
          </div>

          {/* User + Logout — only when logged in */}
          {user && (
            <>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-label">OPERATOR</span>
                <span className="meta-value">{user.username}</span>
              </div>
              <div className="meta-divider" />
              <button className="logout-btn" onClick={handleLogout}>
                ⏻ Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;