import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Login({ setToken, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <nav className="auth-nav">
        <div className="logo-container" onClick={() => setPage("landing")} style={{ cursor: "pointer", margin: 0 }}>
          <img src={logoImg} alt="Splito Logo" className="logo-img" />
          <div className="logo-text">Splito</div>
        </div>
        <div 
          className="footer-link" 
          onClick={() => setPage("landing")} 
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </div>
      </nav>

      <div className="card auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontFamily: 'Outfit' }}>Welcome Back</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "32px", fontSize: "0.95rem" }}>
          Log in to manage your shared expenses.
        </p>

        <form onSubmit={login}>
          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input
              className="input-field"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: "16px" }}>
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "16px", textAlign: "center", padding: "8px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: "32px", padding: "14px" }}>
            {loading ? "Authenticating..." : "Sign in to Dashboard"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          New to Splito?{" "}
          <span className="footer-link" style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("signup")}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}
