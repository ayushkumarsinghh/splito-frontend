import { useState, useEffect } from "react";
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName) return;
    try {
      await axios.post(
        `${API_URL}/api/groups`,
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGroupName("");
      setShowCreate(false);
      refreshDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleRespondInvite = async (inviteId, status) => {
    try {
      await axios.post(
        `${API_URL}/api/invites/${inviteId}/respond`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInvites();
      refreshDashboard();
    } catch (err) {
      setError("Failed to respond to invite");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/groups/${selectedGroup._id}/invite`,
        { username: inviteUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInviteUsername("");
      alert(`Invitation sent to ${inviteUsername}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invitation");
    }
  };

  const fetchGroupBalances = async (groupId) => {
    try {
      const res = await axios.get(`${API_URL}/api/groups/${groupId}/balances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupBalances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectGroup = (group) => {
    setSelectedGroup(group);
    fetchGroupBalances(group._id);
  };

  return (
    <div className="groups-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0 }}>Your Groups</h3>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)} style={{ width: "auto", padding: "0.5rem 1rem" }}>
          {showCreate ? "Cancel" : "+ New Group"}
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {showCreate && (
        <form onSubmit={handleCreateGroup} className="glass-panel" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
          <input
            type="text"
            className="input-field"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          />
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      )}

      {invites.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: "1.5rem", padding: "1rem", borderColor: "var(--primary)" }}>
          <h4 style={{ margin: "0 0 1rem 0" }}>Pending Invites</h4>
          {invites.map((invite) => (
            <div key={invite._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span>{invite.invitedBy.username} invited you to <strong>{invite.groupId.name}</strong></span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-success btn-sm" onClick={() => handleRespondInvite(invite._id, "accepted")} style={{ width: "auto" }}>Accept</button>
                <button className="btn btn-outline btn-sm" onClick={() => handleRespondInvite(invite._id, "rejected")} style={{ width: "auto" }}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="groups-list">
        {groups.length === 0 ? (
          <p className="text-muted">No groups yet.</p>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              className={`group-card ${selectedGroup?._id === group._id ? "active" : ""}`}
              onClick={() => selectGroup(group)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="avatar-small" style={{ background: "var(--primary)", fontSize: "0.8rem" }}>
                  {group.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{group.name}</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>{group.members.length} members</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedGroup && (
        <div className="group-detail-overlay fade-in">
          <div className="glass-panel group-detail-panel">
            <div className="group-detail-header">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="avatar" style={{ width: "50px", height: "50px" }}>
                  {selectedGroup.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: "var(--primary)" }}>{selectedGroup.name}</h2>
                  <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                    Created by {selectedGroup.createdBy === selectedGroup.members[0]._id ? "You" : "a member"}
                  </p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setSelectedGroup(null)}>×</button>
            </div>

            <div className="group-detail-content">
              <div className="detail-section">
                <h4 className="section-title">📊 Group Balances</h4>
                {groupBalances ? (
                  <div className="balances-list">
                    {Object.values(groupBalances).map((mb) => (
                      <div key={mb.username} className="balance-item-row">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div className="avatar-mini">{mb.username.charAt(0).toUpperCase()}</div>
                          <span>{mb.username}</span>
                        </div>
                        <span className={mb.netBalance >= 0 ? "text-success" : "text-danger"} style={{ fontWeight: 700 }}>
                          {mb.netBalance >= 0 ? "+" : "-"}₹{Math.abs(mb.netBalance).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {Object.keys(groupBalances).length === 0 && <p className="text-muted">No balances yet.</p>}
                  </div>
                ) : (
                  <div className="loading-spinner">Loading...</div>
                )}
              </div>

              <div className="detail-section">
                <h4 className="section-title">➕ Invite Friends</h4>
                <form onSubmit={handleInvite} className="invite-form">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter username"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>Invite</button>
                </form>

                <h4 className="section-title" style={{ marginTop: "1.5rem" }}>👥 Members ({selectedGroup.members.length})</h4>
                <div className="members-badges">
                  {selectedGroup.members.map((m) => (
                    <span key={m._id} className="badge-outline">{m.username}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
