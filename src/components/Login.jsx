import { useState } from "react";
import axios from "axios";

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
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
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
      <div className="card" style={{ maxWidth: "420px", width: "100%", padding: "40px" }}>
        <div className="auth-header">
           <div className="auth-badge">Secure Access</div>
           <div 
             style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px", cursor: "pointer" }}
             onClick={() => setPage("landing")}
           >
              <div className="logo-small">S</div>
              <div className="logo">Splito</div>
           </div>
           <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Enter your details to access your dashboard</p>
        </div>

        <form onSubmit={login}>
          <div className="form-group">
            <label className="input-label">Email</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="e.g. alex@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
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
            <div style={{ backgroundColor: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.15)", padding: "10px", borderRadius: "8px", marginBottom: "20px", color: "#f87171", fontSize: "0.8rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: "8px" }}>
            {loading ? "Authenticating..." : "Sign in to Dashboard"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Don't have an account? <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("signup")}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
