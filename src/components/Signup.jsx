import { useState } from "react";
import axios from "axios";

export default function Signup({ setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      <button onClick={() => setPage("landing")} className="btn-back">
        ← Back to Home
      </button>
      <div className="glass-panel auth-card">
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
      </div>
    </div>
  );
}
