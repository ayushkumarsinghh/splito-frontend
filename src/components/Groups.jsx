import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

export default function Groups({ token, groups, refreshDashboard }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [invites, setInvites] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [inviteUsername, setInviteUsername] = useState("");
  const [groupBalances, setGroupBalances] = useState(null);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/invites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvites(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName) return;
    try {
      await axios.post(`${API_URL}/api/groups`, { name: newGroupName }, { headers: { Authorization: `Bearer ${token}` } });
      setNewGroupName("");
      setShowCreate(false);
      refreshDashboard();
    } catch (err) { setError(err.response?.data?.message || "Failed to create group"); }
  };

  const handleRespondInvite = async (inviteId, status) => {
    try {
      await axios.post(`${API_URL}/api/invites/${inviteId}/respond`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchInvites();
      refreshDashboard();
    } catch (err) { setError("Failed to respond to invite"); }
  };

  const fetchGroupBalances = async (groupId) => {
    try {
      const res = await axios.get(`${API_URL}/api/groups/${groupId}/balances`, { headers: { Authorization: `Bearer ${token}` } });
      setGroupBalances(res.data);
    } catch (err) { console.error(err); }
  };

  const selectGroup = (group) => {
    setSelectedGroup(group);
    fetchGroupBalances(group._id);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteUsername) return;
    try {
      await axios.post(`${API_URL}/api/groups/${selectedGroup._id}/invite`, 
        { username: inviteUsername }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInviteUsername("");
      alert("Invite sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invite");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="groups-section fade-in">
      <div className="section-header">
        <h3 style={{ fontSize: "1.5rem" }}>Your Groups</h3>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "+ New Group"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreateGroup} className="balance-card" style={{ marginBottom: "var(--s-32)", borderStyle: "dashed", background: "transparent" }}>
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Enter Group Name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>Create Group</button>
        </form>
      )}

      {invites.length > 0 && (
        <div className="balance-card" style={{ marginBottom: "var(--s-32)", borderColor: "var(--primary)" }}>
          <h4 style={{ marginBottom: "var(--s-16)" }}>Pending Invites</h4>
          {invites.map((invite) => (
            <div key={invite._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <span className="text-secondary"><strong>{invite.invitedBy.username}</strong> → <strong>{invite.groupId.name}</strong></span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-primary" style={{ padding: "4px 12px", background: "var(--primary)", color: "white" }} onClick={() => handleRespondInvite(invite._id, "accepted")}>Accept</button>
                <button className="btn btn-secondary" style={{ padding: "4px 12px" }} onClick={() => handleRespondInvite(invite._id, "rejected")}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="recent-expenses-list">
        {groups.length === 0 ? (
          <div style={{ padding: "var(--s-48)", textAlign: "center", color: "var(--text-secondary)" }}>
            No groups yet. Create one to start splitting!
          </div>
        ) : (
          groups.map((group) => (
            <div key={group._id} className="expense-row" onClick={() => selectGroup(group)} style={{ cursor: "pointer", gridTemplateColumns: "48px 1fr 1fr" }}>
              <div className="expense-avatar" style={{ background: "var(--primary)", color: "white", fontWeight: "bold" }}>
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div className="expense-info">
                <h4>{group.name}</h4>
                <p>{group.members.length} members</p>
              </div>
              <div className="expense-share">
                 <span className="text-secondary">View Details →</span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedGroup && createPortal(
        <div className="modal-overlay fade-in">
          <div className="balance-card" style={{ maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="section-header" style={{ marginBottom: "var(--s-32)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className="logo-icon" style={{ background: "var(--primary)", color: "white" }}>{selectedGroup.name.charAt(0).toUpperCase()}</div>
                <h2 style={{ margin: 0 }}>{selectedGroup.name}</h2>
              </div>
              <button className="btn" style={{ fontSize: "1.5rem", padding: "0 10px", background: "transparent", border: "none", color: "var(--text)" }} onClick={() => setSelectedGroup(null)}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-32)" }}>
              <div>
                <h4 style={{ marginBottom: "var(--s-16)", color: "var(--text-secondary)" }}>Balances</h4>
                {groupBalances ? (
                  Object.values(groupBalances).map((mb) => (
                    <div key={mb.username} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                      <span>{mb.username}</span>
                      <span className={mb.netBalance >= 0 ? "text-success" : "text-danger"} style={{ fontWeight: 700 }}>
                        {mb.netBalance >= 0 ? "+" : "-"}₹{Math.abs(mb.netBalance).toFixed(0)}
                      </span>
                    </div>
                  ))
                ) : <p>Loading...</p>}
              </div>

              <div>
                <h4 style={{ marginBottom: "var(--s-16)", color: "var(--text-secondary)" }}>Members</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedGroup.members.map((m) => (
                    <span key={m._id} style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem" }}>
                      {m.username}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: "var(--s-32)" }}>
                  <h4 style={{ marginBottom: "var(--s-16)", color: "var(--text-secondary)" }}>Invite Member</h4>
                  <form onSubmit={handleInvite} style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Username..."
                      value={inviteUsername}
                      onChange={(e) => setInviteUsername(e.target.value)}
                      style={{ padding: "8px 12px" }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>Invite</button>
                  </form>
                  {error && <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "8px" }}>{error}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
