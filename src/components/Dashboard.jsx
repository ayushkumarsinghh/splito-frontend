import { useEffect, useState } from "react";
import axios from "axios";
import AddExpense from "./AddExpense";
import Settle from "./Settle";
import RecentActivity from "./RecentActivity";
import ExpenseHistory from "./ExpenseHistory";
import Groups from "./Groups";
import Profile from "./Profile";

export default function Dashboard({ token, setToken }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [balances, setBalances] = useState({});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User");

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, [refreshTrigger]);

  const fetchProfile = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsername(res.data.username);
    } catch (err) { console.error(err); }
  };

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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const totalOwedToYou = Object.values(balances).reduce((acc, curr) => acc + (curr.owesYou || 0), 0);
  const totalYouOwe = Object.values(balances).reduce((acc, curr) => acc + (curr.youOwe || 0), 0);

  return (
    <div className="dashboard-layout fade-in">
      {/* Sidebar - No Emojis */}
      <aside className="sidebar">
        <div className="logo-container" style={{ marginBottom: "var(--s-48)" }}>
          <div className="logo-icon">S</div>
          <div className="logo-text">Splito</div>
        </div>
        <nav className="nav-links">
          <div className={`nav-link ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>
             <span className="icon">#</span> <span>Dashboard</span>
          </div>
          <div className={`nav-link ${activeView === "expenses" ? "active" : ""}`} onClick={() => setActiveView("expenses")}>
             <span className="icon">$</span> <span>Expenses</span>
          </div>
          <div className={`nav-link ${activeView === "groups" ? "active" : ""}`} onClick={() => setActiveView("groups")}>
             <span className="icon">@</span> <span>Groups</span>
          </div>
          <div className={`nav-link ${activeView === "activity" ? "active" : ""}`} onClick={() => setActiveView("activity")}>
             <span className="icon">%</span> <span>Activity</span>
          </div>
          <div className={`nav-link ${activeView === "profile" ? "active" : ""}`} onClick={() => setActiveView("profile")}>
             <span className="icon">*</span> <span>Profile</span>
          </div>
          <div className="nav-link">
             <span className="icon">&</span> <span>Settings</span>
          </div>
        </nav>
        
        <div style={{ marginTop: "auto" }}>
          <div 
            className="nav-link" 
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
          >
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-48)" }}>
           <h2 style={{ fontSize: "2rem" }}>Welcome back, {username}</h2>
           <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--surface-hover)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                {username.charAt(0).toUpperCase()}
              </div>
           </div>
        </div>

        {activeView === "profile" ? (
          <Profile token={token} onBack={() => setActiveView("dashboard")} />
        ) : activeView === "groups" ? (
          <Groups token={token} groups={groups} refreshDashboard={() => setRefreshTrigger(p => p + 1)} />
        ) : activeView === "expenses" || activeView === "activity" ? (
          <ExpenseHistory token={token} refreshTrigger={refreshTrigger} />
        ) : (
          <>
            <div className="balance-grid">
              <div className="balance-card owe-card">
                <span className="balance-label">You Owe</span>
                <div className="balance-value">INR {totalYouOwe.toLocaleString()}</div>
                <p className="balance-subtext">Outstanding debts to friends</p>
              </div>
              <div className="balance-card owed-card">
                <span className="balance-label">You Are Owed</span>
                <div className="balance-value">INR {totalOwedToYou.toLocaleString()}</div>
                <p className="balance-subtext">Payments pending from groups</p>
              </div>
            </div>

            <div className="section-header">
              <h3 style={{ fontSize: "1.5rem" }}>Recent Expenses</h3>
              <button className="btn btn-primary" onClick={() => setActiveView("expenses")}>+ Add New Expense</button>
            </div>

            <RecentActivity token={token} refreshTrigger={refreshTrigger} />

            <div style={{ marginTop: "var(--s-48)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-24)" }}>
               <div className="balance-card" style={{ background: "transparent", borderStyle: "dashed" }}>
                  <AddExpense token={token} groups={groups} refresh={() => setRefreshTrigger(p => p + 1)} />
               </div>
               <div className="balance-card" style={{ background: "transparent", borderStyle: "dashed" }}>
                  <Settle token={token} refresh={() => setRefreshTrigger(p => p + 1)} />
               </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
