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
    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(`${API_URL}/api/users/signup`, { username, email, password });
      setPage("login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="card auth-card">
        <div className="logo-container" style={{ justifyContent: "center", marginBottom: "24px" }}>
          <div className="logo-icon">S</div>
          <div className="logo-text">Splito</div>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "8px", fontFamily: 'Outfit' }}>Create Account</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "32px", fontSize: "0.95rem" }}>
          Start tracking shared expenses with clarity.
        </p>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="input-label">Username</label>
            <input
              className="input-field"
              type="text"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: "16px" }}>
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
              placeholder="Min. 8 characters"
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
            {loading ? "Creating Account..." : "Join the Community"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Already a member?{" "}
          <span className="footer-link" style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
