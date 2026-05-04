import { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <p className="text-secondary" style={{ padding: "var(--s-24)" }}>Loading expenses...</p>;

  return (
    <div className="recent-expenses-list">
      {activity.length === 0 ? (
        <div style={{ padding: "var(--s-32)", textAlign: "center", color: "var(--text-secondary)" }}>
          No recent expenses found.
        </div>
      ) : (
        activity.map((item) => (
          <div key={item.id} className="expense-row">
            <div className="expense-avatar">
              {item.type === "expense" ? "🏔️" : "💸"}
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

            <div className="expense-date">
              {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>

            <div className="expense-total">
              ₹{item.amount.toLocaleString()}
            </div>

            <div className="expense-share">
              <label>Your Share</label>
              {item.type === "expense" ? (
                <span className={item.isPayer ? "text-success" : "text-danger"}>
                  {item.isPayer ? "+" : "-"}₹{(item.amount / 2).toLocaleString()}
                </span>
              ) : (
                <span className="text-success">Settled</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
