import { useState, useEffect } from "react";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

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
        </div>
      </div>
    </header>
  );
}

export default Header;