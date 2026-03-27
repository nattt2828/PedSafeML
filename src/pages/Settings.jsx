import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useSettings, DEFAULT_SETTINGS } from "../context/SettingsContext";
import "../styles/settings.css";

function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const navigate = useNavigate();

  // Local form state — only commits to global on Save
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    const threshold = Number(form.alertThreshold);
    if (!form.cameraZone.trim()) errs.cameraZone = "Camera zone name is required.";
    if (isNaN(threshold) || threshold < 1 || threshold > 30)
      errs.alertThreshold = "Threshold must be between 1 and 30 seconds.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    updateSettings({ ...form, alertThreshold: Number(form.alertThreshold) });      //When the user saves the form, the system updates the global settings state using the updateSettings() function.
    setSaved(true);
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_SETTINGS });
    resetSettings();
    setErrors({});
    setSaved(false);
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(settings);

  return (
    <div className="app-shell">
      <Header />

      <main className="settings-main">
        <div className="settings-page-header">
          <div>
            <h2 className="settings-title">
              <span className="settings-title-icon">⚙</span> System Configuration
            </h2>
            <p className="settings-subtitle">
              Manage detection parameters, camera zone, and alert behavior.
            </p>
          </div>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>

          {/* Detection Settings */}
          <section className="settings-section">
            <div className="section-header">
              <span className="section-icon">◉</span>
              <span className="section-title">DETECTION SETTINGS</span>
            </div>

            {/* Alert Threshold */}
            <div className="form-row">
              <div className="form-field">
                <label className="form-label" htmlFor="alertThreshold">
                  ALERT THRESHOLD (seconds)
                </label>
                <p className="form-hint">
                  How long a pedestrian must be detected before the warning light activates.
                </p>
                <div className="threshold-input-wrap">
                  <input
                    id="alertThreshold"
                    name="alertThreshold"
                    type="number"
                    min="1"
                    max="30"
                    className={`form-input input-narrow ${errors.alertThreshold ? "input-error" : ""}`}
                    value={form.alertThreshold}
                    onChange={handleChange}
                  />
                  <span className="input-unit">sec</span>
                </div>
                {errors.alertThreshold && (
                  <span className="field-error">{errors.alertThreshold}</span>
                )}
              </div>

              {/* Sensitivity Mode */}
              <div className="form-field">
                <label className="form-label" htmlFor="sensitivityMode">
                  DETECTION SENSITIVITY
                </label>
                <p className="form-hint">
                  Controls the model's sensitivity to motion near the crosswalk zone.
                </p>
                <select
                  id="sensitivityMode"
                  name="sensitivityMode"
                  className="form-select"
                  value={form.sensitivityMode}
                  onChange={handleChange}
                >
                  <option value="low">Low — Fewer alerts, less noise</option>
                  <option value="standard">Standard — Balanced detection</option>
                  <option value="high">High — Maximum sensitivity</option>
                </select>
              </div>
            </div>

            {/* Confidence Cutoff Slider */}
            <div className="form-field">
              <label className="form-label" htmlFor="confidenceCutoff">
                MODEL CONFIDENCE CUTOFF — {form.confidenceCutoff}%
              </label>
              <p className="form-hint">
                Detections below this confidence score will be ignored.
              </p>
              <div className="slider-wrap">
                <span className="slider-edge">50%</span>
                <input
                  id="confidenceCutoff"
                  name="confidenceCutoff"
                  type="range"
                  min="50"
                  max="99"
                  step="1"
                  className="form-slider"
                  value={form.confidenceCutoff}
                  onChange={handleChange}
                />
                <span className="slider-edge">99%</span>
              </div>
              <div className="slider-labels">
                <span>More detections</span>
                <span>Fewer, higher-quality detections</span>
              </div>
            </div>
          </section>

          {/* Camera & Zone */}
          <section className="settings-section">
            <div className="section-header">
              <span className="section-icon">📷</span>
              <span className="section-title">CAMERA & ZONE</span>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="cameraZone">
                CAMERA ZONE NAME
              </label>
              <p className="form-hint">
                Identifier for this crosswalk camera unit, shown in the dashboard header.
              </p>
              <input
                id="cameraZone"
                name="cameraZone"
                type="text"
                className={`form-input ${errors.cameraZone ? "input-error" : ""}`}
                placeholder="e.g. Crosswalk-01"
                value={form.cameraZone}
                onChange={handleChange}
              />
              {errors.cameraZone && (
                <span className="field-error">{errors.cameraZone}</span>
              )}
            </div>
          </section>

          {/* Notifications */}
          <section className="settings-section">
            <div className="section-header">
              <span className="section-icon">🔔</span>
              <span className="section-title">NOTIFICATIONS</span>
            </div>

            <div className="toggle-row">
              <div>
                <p className="toggle-label">Enable System Notifications</p>
                <p className="form-hint">
                  Log events and alerts to the system log panel on the dashboard.
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="notificationsEnabled"
                  checked={form.notificationsEnabled}
                  onChange={handleChange}
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="form-actions">
            {saved && !hasChanges && (
              <span className="saved-badge">✓ Settings saved successfully</span>
            )}
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Reset to Defaults
            </button>
            <button
              type="submit"
              className={`btn-primary ${!hasChanges && !saved ? "btn-disabled" : ""}`}
              disabled={!hasChanges}
            >
              Save Settings
            </button>
          </div>

        </form>
      </main>

      <footer className="dash-footer">
        <span className="footer-left">© 2026 Pedestrian Lane Safety ML System</span>
        <span className="footer-center">All systems nominal</span>
        <span className="footer-right mono">v1.0.0 · PedSafeML</span>
      </footer>
    </div>
  );
}

export default Settings;