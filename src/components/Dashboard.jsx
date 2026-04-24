import { useEffect, useState } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";
import Settle from "./Settle";
import RecentActivity from "./RecentActivity";
import ExpenseHistory from "./ExpenseHistory";
import UserSummary from "./UserSummary";

export default function Dashboard({ token, setToken }) {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  };

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/balances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances(res.data.balances || {});
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-bg fade-in">
      <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"><span style={{ color: "var(--primary)" }}>Splito</span> 💸</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-outline" onClick={toggleTheme} style={{ padding: "0.5rem 1rem", width: "auto" }}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Balances */}
          <div className="glass-panel">
            <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "var(--primary)" }}>Your Balances</h2>
            <p className="text-muted" style={{ marginBottom: "1rem" }}>Click a card to see details.</p>

            <div className="balances-grid">
              {loading ? (
                <p className="text-muted" style={{ gridColumn: "1/-1" }}>Loading balances...</p>
              ) : Object.keys(balances).length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                  <h3 style={{ margin: 0 }}>You're all settled up!</h3>
                  <p>No outstanding balances right now.</p>
                </div>
              ) : (
                Object.keys(balances).map((userId) => {
                  const b = balances[userId];
                  const isOwed = b.owesYou && b.owesYou > 0;
                  const isDebt = b.youOwe && b.youOwe > 0;
                  
                  return (
                    <div 
                      key={userId} 
                      className={`balance-card ${isOwed ? "owes-you-card" : isDebt ? "you-owe-card" : ""}`}
                      onClick={() => setSelectedUser({ id: userId, name: b.name })}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="balance-header">
                        <div className="avatar">
                          {b.name ? b.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{b.name}</h4>
                      </div>
                      
                      {b.owesYou && (
                        <p className="text-success" style={{ marginTop: "1rem", fontWeight: 600 }}>
                          {b.name} owes you ₹{b.owesYou}
                        </p>
                      )}
                      {b.youOwe && (
                        <p className="text-danger" style={{ marginTop: "1rem", fontWeight: 600 }}>
                          You owe {b.name} ₹{b.youOwe}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* History */}
          <div className="glass-panel">
            <ExpenseHistory token={token} refreshTrigger={refreshTrigger} />
          </div>

        </div>

        {/* Right Column */}
        <div className="forms-container">
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <AddExpense token={token} refresh={fetchBalances} />
          </div>
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <Settle token={token} refresh={fetchBalances} />
          </div>
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <RecentActivity token={token} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>

    {selectedUser && (
      <UserSummary 
        token={token} 
        userId={selectedUser.id} 
        userName={selectedUser.name} 
        onClose={() => setSelectedUser(null)} 
      />
    )}
    </div>
  );
}
