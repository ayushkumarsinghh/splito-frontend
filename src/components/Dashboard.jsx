import { useEffect, useState } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";
import Settle from "./Settle";
import RecentActivity from "./RecentActivity";
import ExpenseHistory from "./ExpenseHistory";
import UserSummary from "./UserSummary";
import Groups from "./Groups";
import Profile from "./Profile";

export default function Dashboard({ token, setToken }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [balances, setBalances] = useState({});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  };

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const [balancesRes, groupsRes] = await Promise.all([
        axios.get(`${API_URL}/api/balances`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/groups`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBalances(balancesRes.data.balances || {});
      setGroups(groupsRes.data || []);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
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
            <button className="btn btn-outline" onClick={() => setActiveView(activeView === "dashboard" ? "profile" : "dashboard")} style={{ padding: "0.5rem 1rem", width: "auto" }}>
              {activeView === "dashboard" ? "👤 Profile" : "🏠 Dashboard"}
            </button>
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
        
        {error && (
          <div className="text-danger" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "1rem", borderRadius: "1rem", marginBottom: "2rem", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {activeView === "profile" ? (
          <Profile token={token} onBack={() => setActiveView("dashboard")} />
        ) : (
          <>
            {/* Top Section: Balances */}
            <div className="glass-panel" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", color: "var(--primary)", margin: 0 }}>Your Balances</h2>
            <p className="text-muted">Click a card to see details.</p>
          </div>

          <div className="balances-grid-horizontal">
            {loading ? (
              <p className="text-muted">Loading balances...</p>
            ) : Object.keys(balances).length === 0 ? (
              <div className="empty-state-mini">
                <div style={{ fontSize: "2rem" }}>🎉</div>
                <p>You're all settled up! No outstanding balances.</p>
              </div>
            ) : (
              Object.keys(balances).map((userId) => {
                const b = balances[userId];
                const isOwed = b.owesYou && b.owesYou > 0;
                const isDebt = b.youOwe && b.youOwe > 0;
                
                return (
                  <div 
                    key={userId} 
                    className={`balance-card-mini ${isOwed ? "owes-you-card" : isDebt ? "you-owe-card" : ""}`}
                    onClick={() => setSelectedUser({ id: userId, name: b.name })}
                  >
                    <div className="balance-header">
                      <div className="avatar-small">
                        {b.name ? b.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h4 style={{ margin: 0, fontSize: "1rem" }}>{b.name}</h4>
                        {b.owesYou && <span className="text-success" style={{ fontSize: "0.9rem", fontWeight: 600 }}>owes you ₹{b.owesYou}</span>}
                        {b.youOwe && <span className="text-danger" style={{ fontSize: "0.9rem", fontWeight: 600 }}>you owe ₹{b.youOwe}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Groups Section */}
        <div className="glass-panel" style={{ marginBottom: "2rem" }}>
          <Groups token={token} groups={groups} refreshDashboard={fetchDashboardData} />
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-layout-grid">
          {/* Left Column: Add Expense -> History */}
          <div className="layout-col">
            <div className="glass-panel">
              <AddExpense token={token} groups={groups} refresh={fetchDashboardData} />
            </div>
            <div className="glass-panel">
              <ExpenseHistory token={token} refreshTrigger={refreshTrigger} />
            </div>
          </div>

          {/* Right Column: Settle Up -> Recent Activity */}
          <div className="layout-col">
            <div className="glass-panel">
              <Settle token={token} refresh={fetchDashboardData} />
            </div>
            <div className="glass-panel">
              <RecentActivity token={token} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
        </>
        )}
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
