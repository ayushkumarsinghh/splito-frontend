import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, CreditCard, Lock, Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

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
      setError("Failed to load profile settings.");
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
      
      setMessage("Account settings updated successfully!");
      setPassword(""); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px", color: "var(--text-secondary)" }}>Loading your settings...</div>;

  return (
    <div className="profile-settings fade-in" style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h2 style={{ fontSize: "2.5rem", fontFamily: 'Outfit', marginBottom: "8px" }}>Account Settings</h2>
          <p style={{ color: "var(--text-secondary)" }}>Manage your personal information and security.</p>
        </div>
        <button className="nav-link" onClick={onBack} style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {message && (
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", padding: "16px 24px", borderRadius: "16px", marginBottom: "32px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 500 }}>{message}</span>
        </div>
      )}
      
      {error && (
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", padding: "16px 24px", borderRadius: "16px", marginBottom: "32px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 500 }}>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: "40px" }}>
        <form onSubmit={handleUpdate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          <div className="form-group">
            <label className="input-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={14} /> Username
            </label>
            <input
              type="text"
              className="input-field"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="input-field"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={14} /> UPI ID (for settlements)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="username@upi"
              value={profile.upiId}
              onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "8px" }}>This will be shared with group members to pay you.</p>
          </div>

          <div className="form-group">
            <label className="input-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={14} /> Update Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "8px" }}>Leave blank to keep current password.</p>
          </div>

          <div style={{ gridColumn: "1 / -1", marginTop: "16px" }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: "14px 32px" }}>
              <Save size={18} style={{ marginRight: "10px" }} />
              {saving ? "Saving Changes..." : "Update Settings"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
