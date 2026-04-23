import { useState } from "react";
import axios from "axios";

export default function Login({ setToken, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <button onClick={() => setPage("landing")} className="btn-back">
        ← Back to Home
      </button>
      <div className="glass-panel auth-card">
        <h2 className="text-gradient" style={{ textAlign: "center" }}>Welcome Back</h2>
        <p className="text-muted" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          Log in to continue settling up.
        </p>

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

        <button className="btn btn-primary" onClick={login} disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <span className="clickable-link" onClick={() => setPage("signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
