import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";

export default function RecentActivity({ token, refreshTrigger }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivity(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [token, refreshTrigger]);

  if (loading) return <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Loading activity...</div>;

  return (
    <div className="recent-expenses-list fade-in">
      {activity.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px", background: "transparent", borderStyle: "dashed" }}>
          <p style={{ color: "var(--text-secondary)" }}>No recent activity to show.</p>
        </div>
      ) : (
        activity.slice(0, 3).map((item) => (
          <div key={item.id} className="expense-row">
            <div className="expense-icon">
              {item.type === "expense" ? <CreditCard size={20} /> : <ArrowUpRight size={20} />}
            </div>
            
            <div className="expense-info">
              {item.type === "expense" ? (
                <>
                  <h4>{item.description}</h4>
                  <p>{item.groupName || "Personal"} • Paid by {item.isPayer ? "You" : item.paidBy}</p>
                </>
              ) : (
                <>
                  <h4>Settlement</h4>
                  <p>{item.isFromMe ? `You paid ${item.to}` : `${item.from} paid you`}</p>
                </>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.85rem", marginRight: "24px" }}>
              <Calendar size={14} />
              {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>

            <div className="expense-amount">
              <div className="amount-value">₹{item.amount.toLocaleString()}</div>
              <div className="amount-subtext">Total</div>
            </div>

            <div className="expense-share" style={{ minWidth: "120px", textAlign: "right" }}>
              <label style={{ display: "block", fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "4px" }}>Your Share</label>
              {item.type === "expense" ? (
                <span className={`badge ${item.isPayer ? "badge-success" : "badge-danger"}`}>
                  {item.isPayer ? "+" : "-"}₹{(item.amount / 2).toLocaleString()}
                </span>
              ) : (
                <span className="badge badge-success">Settled</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
