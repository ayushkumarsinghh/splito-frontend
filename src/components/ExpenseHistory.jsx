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
      <div className="history-header">
        <h3 style={{ margin: 0, fontSize: "1.4rem", color: "var(--primary)" }}>Expense History</h3>
        <div className="search-box">
          <input
            type="text"
            className="input-field"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading history...</p>
      ) : expenses.length === 0 ? (
        <p className="text-muted" style={{ marginTop: "1rem" }}>No expenses found.</p>
      ) : (
        <div className="history-list">
          {expenses.map((expense) => (
            <div key={expense._id} className="history-item">
              <div className="history-info">
                <span className="history-desc">{expense.description || "No description"}</span>
                <span className="history-meta">
                  Paid by <strong>{expense.paidBy?.username}</strong> {expense.groupId && <>in <strong>{expense.groupId.name}</strong></>} on {new Date(expense.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="history-amount">
                ₹{expense.amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
