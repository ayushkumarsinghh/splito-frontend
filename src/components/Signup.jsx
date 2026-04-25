import { useState, useEffect } from "react";
import axios from "axios";
import BentoPanel from "./MagicBento/BentoPanel";

export default function Signup({ setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  };

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
  }, []);

  const signup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(`${API_URL}/api/signup`, {
        username,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        setPage("login");
      }, 1500);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <div style={{ position: "absolute", top: "2rem", left: "2rem", right: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1000 }}>
        <button onClick={() => setPage("landing")} className="btn-back" style={{ position: "static" }}>
          ← Back to Home
        </button>
        <button className="btn btn-outline" onClick={toggleTheme} style={{ width: "auto", padding: "0.6rem 1.2rem", background: "var(--panel-bg)", backdropFilter: "blur(10px)" }}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
        <BentoPanel className="auth-card" style={{ maxWidth: "440px", padding: "2.5rem" }}>
          <h2 className="text-gradient" style={{ textAlign: "center" }}>Create Account</h2>
          <p className="text-muted" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            Join Splito to easily track expenses.
          </p>

          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              className="input-field"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              className="input-field"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-danger" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              {error}
            </div>
          )}

          {success && (
            <div className="text-success" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              {success}
            </div>
          )}

          <button className="btn btn-primary" onClick={signup} disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <span className="clickable-link" onClick={() => setPage("login")}>
              Login
            </span>
          </p>
        </BentoPanel>
      </div>
    </div>
  );
}
