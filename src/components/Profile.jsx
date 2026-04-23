import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile({ token }) {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setUsername(res.data.username || "");
      setEmail(res.data.email || "");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  if (loading) return <p className="text-muted">Loading profile...</p>;

  return (
    <div className="glass-panel" style={{ padding: "2rem", width: "100%" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your Profile</h2>
      <p className="text-muted">Manage your account details.</p>

      {message.text && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`} style={{ marginBottom: "1rem", padding: "0.5rem", borderRadius: "8px", backgroundColor: message.type === "success" ? "rgba(46, 213, 115, 0.1)" : "rgba(255, 71, 87, 0.1)", color: message.type === "success" ? "#2ed573" : "#ff4757" }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdate} style={{ marginTop: "1.5rem" }}>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Username</label>
          <input
            type="text"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
          Save Details
        </button>
      </form>
    </div>
  );
}
