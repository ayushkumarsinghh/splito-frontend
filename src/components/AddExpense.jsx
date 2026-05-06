import { useState } from "react";
import axios from "axios";

export default function AddExpense({ token, groups, refresh }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState("");
  const [splitWith, setSplitWith] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const addExpense = async (e) => {
    e.preventDefault();
    setError("");
    if (!description || !amount) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/expenses`,
        {
          description,
          amount: Number(amount),
          groupId: groupId || null,
          splitWith: groupId ? [] : splitWith, // If group, server handles split. Else use provided members.
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDescription("");
      setAmount("");
      setGroupId("");
      setSplitWith([]);
      setSuccess("Expense added successfully!");
      setTimeout(() => setSuccess(""), 3000);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-form">
      <h3>Add Expense</h3>
      <p className="text-meta" style={{ marginBottom: "var(--s-16)" }}>Log a new shared cost.</p>

      <form onSubmit={addExpense} style={{ display: "flex", flexDirection: "column", gap: "var(--s-16)" }}>
        <div className="form-group">
          <label className="input-label">Description</label>
          <input
            className="input-field"
            placeholder="e.g. Dinner, Movie, Groceries"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Amount (₹)</label>
          <input
            className="input-field"
            placeholder="0.00"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Group (Optional)</label>
          <select
            className="input-field"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            style={{ appearance: "none" }}
          >
            <option value="">Personal / No Group</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-danger fade-in" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px", textAlign: "center", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="text-success fade-in" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.75rem", borderRadius: "8px", textAlign: "center", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            {success}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: "100%", marginTop: "var(--s-8)" }}
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
