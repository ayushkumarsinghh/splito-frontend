import { useState } from "react";
import axios from "axios";

export default function Settle({ token, refresh }) {
  const [toUsername, setToUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const settle = async () => {
    if (!toUsername || !amount) return alert("Please fill all fields");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(
        `${API_URL}/api/settle`,
        {
          toUsername: toUsername.trim(),
          amount: Number(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToUsername("");
      setAmount("");
      refresh();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Settlement failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-form" style={{ border: "none", padding: 0, background: "transparent" }}>
      <h3>🤝 Settle Up</h3>
      <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>Pay back what you owe.</p>

      <div className="input-group">
        <label className="input-label">Recipient Username</label>
        <input
          className="input-field"
          placeholder="johndoe"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Amount (₹)</label>
        <input
          className="input-field"
          placeholder="e.g. 250"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button 
        className="btn" 
        onClick={settle} 
        disabled={loading}
        style={{ background: "var(--success)", color: "white" }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
