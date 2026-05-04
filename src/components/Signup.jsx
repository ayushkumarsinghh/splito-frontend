import { useState } from "react";
import axios from "axios";

export default function Signup({ setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(`${API_URL}/api/register`, { username, email, password });
      alert("Welcome to Splito! Please log in to start splitting.");
      setPage("login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="card" style={{ maxWidth: "420px", width: "100%", padding: "40px" }}>
        <div className="auth-header">
           <div className="auth-badge">Early Access</div>
           <div 
             style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px", cursor: "pointer" }}
             onClick={() => setPage("landing")}
           >
              <div className="logo-small">S</div>
              <div className="logo">Splito</div>
           </div>
           <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Create your account and simplify your shared life</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="input-label">Username</label>
            <input 
              className="input-field" 
              type="text" 
              placeholder="e.g. janesmith" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="e.g. jane@example.com" 
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
              placeholder="Min. 8 characters" 
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
            {loading ? "Preparing your dashboard..." : "Join the Community"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Already a member? <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("login")}>Sign in</span>
          </p>
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
             <span>No spam. Secure authentication guaranteed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
