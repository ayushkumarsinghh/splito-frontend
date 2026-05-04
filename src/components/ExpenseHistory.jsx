import { useEffect, useState } from "react";
import axios from "axios";

export default function ExpenseHistory({ token, refreshTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchExpenses = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/expenses?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchExpenses();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, token, refreshTrigger]);

  return (
    <div className="expense-history">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-24)" }}>
        <h2 style={{ margin: 0 }}>History</h2>
        <input
          type="text"
          className="input-field"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "150px", padding: "8px 12px", fontSize: "0.85rem" }}
        />
      </div>

      {loading ? (
        <p className="text-meta">Loading history...</p>
      ) : expenses.length === 0 ? (
        <div className="empty-state-mini">
           <p>No expenses found.</p>
        </div>
      ) : (
        <div className="history-list">
          {expenses.map((expense) => (
            <div key={expense._id} className="history-item">
              <div className="history-info">
                <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>{expense.description || "No description"}</span>
                <span className="text-meta" style={{ display: "block" }}>
                  Paid by <strong>{expense.paidBy?.username}</strong> {expense.groupId && <>in <strong>{expense.groupId.name}</strong></>}
                </span>
                <span className="text-meta" style={{ fontSize: "0.75rem" }}>{new Date(expense.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="h3" style={{ margin: 0, color: "var(--primary)" }}>
                ₹{expense.amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
