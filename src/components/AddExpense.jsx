import { useState } from "react";
import axios from "axios";

export default function AddExpense({ token, refresh }) {
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState("");
  const [paidByUsername, setPaidByUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const add = async () => {
    setError("");
    if (!amount || !participants) {
      setError("Please fill amount and participants");
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(
        `${API_URL}/api/expense`,
        {
          amount: Number(amount),
          description: "Expense",
          participants: participants.split(",").map(id => id.trim()),
          paidByUsername: paidByUsername.trim() || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAmount("");
      setParticipants("");
      setPaidByUsername("");
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
          placeholder="johndoe, janedoe"
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
