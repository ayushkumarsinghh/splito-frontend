import { useEffect, useState } from "react";
import axios from "axios";

export default function UserSummary({ token, userId, userName, onClose }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserExpenses = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/expenses?user=${userId}`, {
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
    fetchUserExpenses();
  }, [userId, token]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        <h2 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
          Summary with {userName}
        </h2>
        <p className="text-muted" style={{ marginBottom: "2rem" }}>
          Detailed list of expenses shared with {userName}.
        </p>

        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-muted">No shared expenses found.</p>
        ) : (
          <div className="history-list">
            {expenses.map((expense) => (
              <div key={expense._id} className="history-item">
                <div className="history-info">
                  <span className="history-desc">{expense.description || "No description"}</span>
                  <span className="history-meta">
                    {new Date(expense.createdAt).toLocaleDateString()}
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
    </div>
  );
}
