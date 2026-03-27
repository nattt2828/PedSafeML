import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });      // State to store form input values
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {           // Function that updates input fields when user types
    const { name, value } = e.target;               //When the user types in the form fields, the handleChange() function updates the state.
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {             // Function that runs when form is submitted
    e.preventDefault();                       //When the form is submitted, the handleSubmit() function validates the input and authenticates the user.
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    // Simulate brief auth delay for realism
    setTimeout(() => {
      const result = login(formData.username.trim(), formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-shell">
      {/* Background grid */}
      <div className="login-bg-grid" />

      <div className="login-card">
        {/* Logo / branding */}
        <div className="login-brand">
          <div className="login-brand-icon">⬡</div>
          <div>
            <h1 className="login-brand-title">
              PedSafe<span className="login-accent">ML</span>
            </h1>
            <p className="login-brand-sub">Pedestrian Detection Crosswalk Safety System</p>
          </div>
        </div>

        <div className="login-divider" />

        <p className="login-heading">Operator Sign In</p>
        <p className="login-subheading">Enter your credentials to access the monitoring dashboard.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="field-group">
            <label className="field-label" htmlFor="username">USERNAME</label>
            <div className="field-input-wrap">
              <span className="field-icon">👤</span>
              <input
                id="username"
                className={`field-input ${error ? "input-error" : ""}`}
                type="text"
                name="username"
                placeholder="e.g. admin"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-label" htmlFor="password">PASSWORD</label>
            <div className="field-input-wrap">
              <span className="field-icon">🔒</span>
              <input
                id="password"
                className={`field-input ${error ? "input-error" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="show-pass-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`login-btn ${isLoading ? "login-btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner">Authenticating<span className="dots">...</span></span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="login-demo-hint">
          <p className="hint-label">DEMO CREDENTIALS</p>
          <div className="hint-rows">
            <div className="hint-row">
              <span className="hint-role">Administrator</span>
              <span className="hint-cred mono">admin / pedsafe123</span>
            </div>
            <div className="hint-row">
              <span className="hint-role">Operator</span>
              <span className="hint-cred mono">operator / operator123</span>
            </div>
          </div>
        </div>
      </div>

      <p className="login-footer">© 2026 PedSafeML · v1.0.0</p>
    </div>
  );
}

export default Login;