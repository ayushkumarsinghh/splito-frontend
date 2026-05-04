import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile({ token, onBack }) {
  const [profile, setProfile] = useState({ username: "", email: "", upiId: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({
        username: res.data.username || "",
        email: res.data.email || "",
        upiId: res.data.upiId || ""
      });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updateData = {
        username: profile.username,
        email: profile.email,
        upiId: profile.upiId,
      };
      
      if (password) {
        updateData.password = password;
      }

      await axios.put(`${API_URL}/api/users/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage("Profile updated successfully!");
      setPassword(""); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted">Loading profile...</div>;
  }

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-32)" }}>
        <h2 style={{ margin: 0 }}>Profile Settings</h2>
        <button className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={onBack}>
          Back
        </button>
      </div>

      {message && (
        <div className="text-success" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.2)", fontSize: "0.9rem" }}>
          {message}
        </div>
      )}
      
      {error && (
        <div className="text-danger" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "var(--s-24)", maxWidth: "500px" }}>
        
        <div className="form-group">
          <label className="input-label">Username</label>
          <input
            type="text"
            className="input-field"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">UPI ID (Optional)</label>
          <input
            type="text"
            className="input-field"
            placeholder="username@upi"
            value={profile.upiId}
            onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
          />
          <span className="text-muted" style={{ fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
            Friends will use this to settle up with you.
          </span>
        </div>

        <div className="form-group">
          <label className="input-label">New Password (Optional)</label>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start", minWidth: "140px" }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}
