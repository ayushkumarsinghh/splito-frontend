import { useState, useEffect } from "react";
import axios from "axios";

export default function AddExpense({ token, groups, refresh }) {
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState("");
  const [paidByUsername, setPaidByUsername] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const add = async () => {
    setError("");
    if (!amount || (!participants && !selectedGroupId)) {
      setError("Please fill amount and participants (or select a group)");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/expense`,
        {
          amount: Number(amount),
          description: description || "Expense",
          participants: participants ? participants.split(",").map(id => id.trim()) : undefined,
          paidByUsername: paidByUsername.trim() || undefined,
          groupId: selectedGroupId || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAmount("");
      setParticipants("");
      setPaidByUsername("");
      setDescription("");
      setSelectedGroupId("");
      refresh();
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-form" style={{ border: "none", padding: 0, background: "transparent" }}>
      <h3>💸 Add Expense</h3>
      <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>Split a new bill with friends.</p>
      
      <div className="input-group">
        <label className="input-label">Who paid? (Optional Username)</label>
        <input
          className="input-field"
          placeholder="Leave blank for you"
          value={paidByUsername}
          onChange={(e) => setPaidByUsername(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Description</label>
        <input
          className="input-field"
          placeholder="What was it for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Expense Category / Group</label>
        <select
          className="input-field"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          style={{ fontWeight: 600, color: selectedGroupId ? "var(--primary)" : "inherit" }}
        >
          <option value="">👤 Personal / Direct Split</option>
          <optgroup label="Your Groups">
            {groups.map(g => (
              <option key={g._id} value={g._id}>👥 {g.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="input-group">
        <label className="input-label">Amount (₹)</label>
        <input
          className="input-field"
          placeholder="e.g. 500"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Usernames (comma separated)</label>
        <input
          className="input-field"
          placeholder={selectedGroupId ? "Optional for groups" : "johndoe, janedoe"}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-danger" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          {error}
        </div>
      )}

      <button className="btn btn-primary" onClick={add} disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </div>
  );
}
