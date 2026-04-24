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

  if (loading) return <p className="text-muted">Loading activity...</p>;

  return (
    <div className="activity-feed">
      <h3 style={{ marginBottom: "1.5rem", fontSize: "1.4rem", color: "var(--primary)" }}>Recent Activity</h3>
      {activity.length === 0 ? (
        <p className="text-muted">No recent activity.</p>
      ) : (
        <div className="activity-list">
          {activity.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-icon">
                {item.type === "expense" ? "💸" : "🤝"}
              </div>
              <div className="activity-details">
                {item.type === "expense" ? (
                  <p>
                    <strong>{item.isPayer ? "You" : item.paidBy}</strong> added "
                    <strong>{item.description}</strong>"
                    <br />
                    <span className="activity-amount">₹{item.amount}</span>
                  </p>
                ) : (
                  <p>
                    <strong>{item.isFromMe ? "You" : item.from}</strong> paid{" "}
                    <strong>{item.isFromMe ? item.to : "you"}</strong>
                    <br />
                    <span className="activity-amount">₹{item.amount}</span>
                  </p>
                )}
                <span className="activity-time">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
