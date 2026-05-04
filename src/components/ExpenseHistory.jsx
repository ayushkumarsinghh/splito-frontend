import { useEffect, useState } from "react";
import axios from "axios";
import { Receipt, Search, Filter, Calendar } from "lucide-react";

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
    <div className="expense-history fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "2rem", fontFamily: 'Outfit' }}>History</h2>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "250px", paddingLeft: "40px" }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Loading history...</div>
      ) : expenses.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px", background: "transparent", borderStyle: "dashed" }}>
           <p style={{ color: "var(--text-secondary)" }}>No expenses found matching your search.</p>
        </div>
      ) : (
        <div className="history-list">
          {expenses.map((expense) => (
            <div key={expense._id} className="history-item">
              <div className="expense-icon">
                <Receipt size={22} />
              </div>
              
              <div className="expense-info">
                <h4>{expense.description || "No description"}</h4>
                <p>
                  Paid by <strong>{expense.paidBy?.username}</strong> 
                  {expense.groupId && <> in <span style={{ color: "var(--primary)" }}>{expense.groupId.name}</span></>}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                <Calendar size={14} />
                {new Date(expense.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              <div className="expense-amount">
                <div className="amount-value" style={{ color: "var(--primary)" }}>₹{expense.amount.toLocaleString()}</div>
                <div className="amount-subtext">Total Amount</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
