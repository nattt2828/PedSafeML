import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import StatusCard from "../components/StatusCard";
import { useSettings } from "../context/SettingsContext";
import "../styles/dashboard.css";

function Dashboard() {
  const { settings } = useSettings();
  const { alertThreshold, cameraZone, confidenceCutoff, sensitivityMode } = settings;

  const systemStatus = "Active";
  const [pedestrianDetected, setPedestrianDetected] = useState(true);          // if AI detects a person
  const [detectionTime, setDetectionTime] = useState(0);                      //how long the person is detected
  const [warningLight, setWarningLight] = useState("OFF");                   //alert status
  const [logs, setLogs] = useState([]);                                     //event history
  const logsEndRef = useRef(null);    

  // Detection timer                
  useEffect(() => {                     
    let timer;
    if (pedestrianDetected) {
      timer = setInterval(() => setDetectionTime((prev) => prev + 1), 1000);      // Timer increases when detection occurs
    }
    return () => clearInterval(timer);
  }, [pedestrianDetected]);

  // Activate warning light at alertThreshold seconds
  useEffect(() => {
    if (detectionTime >= alertThreshold && warningLight === "OFF" && pedestrianDetected) {
      setWarningLight("ORANGE");
      addLog("WARNING", `${alertThreshold}-second threshold reached. Warning light activated.`);
    }
  }, [detectionTime, alertThreshold, warningLight, pedestrianDetected]);

  // Scroll logs to latest entry
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (level, message) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [{ id: Date.now(), level, message, timestamp }, ...prev]);
  };

  const isWarningActive = warningLight === "ORANGE";
  const progressPct = Math.min((detectionTime / alertThreshold) * 100, 100);

  const toggleDetection = () => {
    if (pedestrianDetected) {
      setPedestrianDetected(false);
      setDetectionTime(0);
      setWarningLight("OFF");
      addLog("INFO", "Pedestrian detection cleared. Warning light deactivated.");
    } else {
      setPedestrianDetected(true);
      setDetectionTime(0);
      addLog("INFO", "Pedestrian detected at crosswalk zone.");
    }
  };

  return (
    <div className={`app-shell ${isWarningActive ? "warning-active" : ""}`}>

      {/* ── HEADER COMPONENT ── */}
      <Header />

      <main className="dash-main">

        {/* ── TOP ROW: Video Feed + Warning Light ── */}
        <div className="top-row">

          {/* LIVE FEED */}
          <section className="panel feed-panel">
            <div className="panel-header">
              <span className="panel-title">
                <span className="panel-icon">◉</span> LIVE FEED
              </span>
              <span className="live-badge">
                <span className="live-dot"></span> LIVE
              </span>
            </div>

            <div className="video-container">
              <div className="video-overlay-grid"></div>
              <div className="video-corners">
                <span className="corner tl"></span>
                <span className="corner tr"></span>
                <span className="corner bl"></span>
                <span className="corner br"></span>
              </div>
              <div className="video-center-content">
                <div className="camera-icon">📷</div>
                <p className="video-label">Sidewalk Detection Zone</p>
                <p className="video-sublabel">Camera Unit 01 — Active</p>
              </div>
              {pedestrianDetected && (
                <div className="detection-box">
                  <span className="detection-label">PEDESTRIAN DETECTED</span>
                </div>
              )}
              <div className="video-scanline"></div>
            </div>

            <div className="feed-footer">
              <span className="feed-stat">RES: 1920×1080</span>
              <span className="feed-stat">FPS: 30</span>
              <span className="feed-stat">MODEL: YOLOv8</span>
              <span className="feed-stat">CONF: {confidenceCutoff}%</span>
            </div>
          </section>

          {/* WARNING LIGHT */}
          <section className="panel warning-panel">
            <div className="panel-header">
              <span className="panel-title">
                <span className="panel-icon">⚠</span> WARNING LIGHT STATUS
              </span>
            </div>

            <div className="warning-light-display">
              <div className={`warning-orb ${isWarningActive ? "orb-active" : "orb-inactive"}`}>
                <div className="orb-inner">
                  <span className="orb-icon">{isWarningActive ? "⚠" : "◯"}</span>
                </div>
                <div className="orb-ring ring-1"></div>
                <div className="orb-ring ring-2"></div>
                <div className="orb-ring ring-3"></div>
              </div>
              <p className={`warning-label ${isWarningActive ? "label-active" : "label-inactive"}`}>
                {isWarningActive ? "WARNING ACTIVE" : "STANDBY"}
              </p>
              <p className="warning-sublabel">
                {isWarningActive
                  ? "Drivers alerted — pedestrian crossing"
                  : "No alert condition detected"}
              </p>
            </div>

            {/* Detection Threshold Progress */}
            <div className="detection-progress-block">
              <div className="progress-header">
                <span className="progress-label">DETECTION THRESHOLD</span>
                <span className="progress-value mono">{detectionTime}s / {alertThreshold}s</span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill ${progressPct >= 100 ? "fill-complete" : ""}`}
                  style={{ width: `${progressPct}%` }}
                ></div>
                {Array.from({ length: alertThreshold }, (_, i) => i + 1).map((tick) => (
                  <div key={tick} className="progress-tick" style={{ left: `${(tick / alertThreshold) * 100}%` }} />
                ))}
              </div>
              <div className="progress-ticks-label">
                {Array.from({ length: alertThreshold }, (_, i) => i + 1).map((t) => (
                  <span key={t}>{t}s</span>
                ))}
              </div>
            </div>

            <button className="toggle-btn" onClick={toggleDetection}>
              {pedestrianDetected ? "⬛  Clear Detection" : "⬤  Simulate Detection"}
            </button>
          </section>
        </div>

        {/* ── STATUS CARDS ROW using StatusCard component ── */}
        <section className="status-row">
          <StatusCard title="SYSTEM STATUS"       value={systemStatus} />
          <div className="sc-divider" />
          <StatusCard title="PEDESTRIAN PRESENCE" value={pedestrianDetected ? "Detected" : "Not Detected"} />
          <div className="sc-divider" />
          <StatusCard title="DETECTION DURATION"  value={detectionTime} unit="sec" />
          <div className="sc-divider" />
          <StatusCard title="WARNING LIGHT"       value={warningLight} />
          <div className="sc-divider" />
          <StatusCard title="UPTIME"              value="99.8%" />
        </section>

        {/* ── BOTTOM ROW: Logs + Stats ── */}
        <div className="bottom-row">

          {/* SYSTEM LOGS */}
          <section className="panel logs-panel">
            <div className="panel-header">
              <span className="panel-title">
                <span className="panel-icon">≡</span> SYSTEM LOGS
              </span>
              <span className="log-count">{logs.length} events</span>
            </div>
            <div className="logs-container">
              {logs.length === 0 && (
                <div className="log-empty">No events recorded yet.</div>
              )}
              {logs.map((log) => (
                <div key={log.id} className={`log-entry log-${log.level.toLowerCase()}`}>
                  <span className="log-ts mono">{log.timestamp}</span>
                  <span className={`log-level level-${log.level.toLowerCase()}`}>{log.level}</span>
                  <span className="log-msg">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </section>

          {/* SESSION STATS + SYSTEM INFO */}
          <section className="panel stats-panel">
            <div className="panel-header">
              <span className="panel-title">
                <span className="panel-icon">◈</span> SESSION STATS
              </span>
            </div>

            <div className="stats-grid">
              <div className="stat-block">
                <span className="stat-num mono">1</span>
                <span className="stat-label">Detections Today</span>
              </div>
              <div className="stat-block">
                <span className="stat-num mono">{isWarningActive ? "1" : "0"}</span>
                <span className="stat-label">Alerts Triggered</span>
              </div>
              <div className="stat-block">
                <span className="stat-num mono">{confidenceCutoff}%</span>
                <span className="stat-label">Model Confidence</span>
              </div>
              <div className="stat-block">
                <span className="stat-num mono">0</span>
                <span className="stat-label">False Positives</span>
              </div>
            </div>

            <div className="system-info">
              <div className="panel-header" style={{ marginTop: "1.5rem" }}>
                <span className="panel-title">
                  <span className="panel-icon">⬡</span> SYSTEM INFO
                </span>
              </div>
              <div className="info-rows">
                {[
                  { key: "Detection Model", val: "YOLOv8-nano" },
                  { key: "Alert Threshold",  val: `${alertThreshold} seconds`, mono: true },
                  { key: "Camera Zone",      val: cameraZone },
                  { key: "Sensitivity",      val: sensitivityMode.charAt(0).toUpperCase() + sensitivityMode.slice(1) },
                  { key: "Hardware",         val: "Raspberry Pi 4B" },
                  { key: "Light Output",     val: "Orange LED Array" },
                ].map(({ key, val, mono }) => (
                  <div className="info-row" key={key}>
                    <span className="info-key">{key}</span>
                    <span className={`info-val ${mono ? "mono" : ""}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="dash-footer">
        <span className="footer-left">© 2026 Pedestrian Lane Safety ML System</span>
        <span className="footer-center">All systems nominal</span>
        <span className="footer-right mono">v1.0.0 · PedSafeML</span>
      </footer>
    </div>
  );
}

export default Dashboard;