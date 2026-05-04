import { useEffect, useState } from "react";
import axios from "axios";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Settings, 
  LogOut, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
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
  const [username, setUsername] = useState("User");
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, [refreshTrigger, token]);

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
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const [balancesRes, groupsRes] = await Promise.all([
        axios.get(`${API_URL}/api/balances`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/groups`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBalances(balancesRes.data.balances || {});
      setGroups(groupsRes.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const totalOwedToYou = Object.values(balances).reduce((acc, curr) => acc + (curr.owesYou || 0), 0);
  const totalYouOwe = Object.values(balances).reduce((acc, curr) => acc + (curr.youOwe || 0), 0);

  const NavItem = ({ id, icon: Icon, label }) => (
    <div 
      className={`nav-link ${activeView === id ? "active" : ""}`} 
      onClick={() => setActiveView(id)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );

  const BalanceDetailList = ({ type }) => {
    const isOwe = type === 'owe';
    const list = Object.entries(balances)
      .filter(([_, val]) => isOwe ? val.youOwe > 0 : val.owesYou > 0)
      .map(([_, val]) => ({
        user: val.name || "Unknown User",
        amount: isOwe ? val.youOwe : val.owesYou
      }));

    return (
      <div className="fade-in" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
        <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase" }}>
          Breakdown
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {list.length === 0 ? (
             <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>No debts found.</p>
          ) : list.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>
                  {item.user.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 500 }}>{item.user}</span>
              </div>
              <span style={{ fontWeight: 700, color: isOwe ? "var(--danger)" : "var(--success)" }}>
                ₹{item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const QuickActions = () => (
    <div style={{ marginBottom: "48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div className="balance-card" style={{ background: "rgba(255,255,255,0.02)", borderStyle: "dashed" }}>
        <AddExpense token={token} groups={groups} refresh={() => setRefreshTrigger(p => p + 1)} />
      </div>
      <div className="balance-card" style={{ background: "rgba(255,255,255,0.02)", borderStyle: "dashed" }}>
        <Settle token={token} refresh={() => setRefreshTrigger(p => p + 1)} />
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout fade-in">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <div className="logo-text">Splito</div>
        </div>
        
        <nav className="nav-links">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="groups" icon={Users} label="Groups" />
          <NavItem id="activity" icon={Activity} label="Activity" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>
        
        <div style={{ marginTop: "auto" }}>
          <div className="nav-link" onClick={() => { localStorage.removeItem("token"); setToken(null); }}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
           <div>
             <h2 style={{ fontSize: "2.5rem", fontFamily: 'Outfit' }}>Welcome back, {username}</h2>
             <p style={{ color: "var(--text-secondary)" }}>Here's what's happening with your expenses.</p>
           </div>
           <div className="avatar-circle" style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--primary-glow)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
             {username.charAt(0).toUpperCase()}
           </div>
        </header>

        {activeView === "settings" ? (
          <Profile token={token} onBack={() => setActiveView("dashboard")} />
        ) : activeView === "groups" ? (
          <Groups token={token} groups={groups} refreshDashboard={() => setRefreshTrigger(p => p + 1)} />
        ) : activeView === "activity" ? (
          <>
            <QuickActions />
            <ExpenseHistory token={token} refreshTrigger={refreshTrigger} />
          </>
        ) : (
          <>
            <QuickActions />

            <div className="balance-grid" style={{ marginBottom: "48px" }}>
              <div 
                className={`balance-card owe-card ${expandedCard === 'owe' ? 'expanded' : ''}`}
                onClick={() => setExpandedCard(expandedCard === 'owe' ? null : 'owe')}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="balance-label">You Owe</span>
                  <TrendingDown color="var(--danger)" />
                </div>
                <div className="balance-value">₹{totalYouOwe.toLocaleString()}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {expandedCard === 'owe' ? "Click to collapse" : "Total outstanding debts • Click to expand"}
                </p>
                {expandedCard === 'owe' && <BalanceDetailList type="owe" />}
              </div>
              
              <div 
                className={`balance-card owed-card ${expandedCard === 'owed' ? 'expanded' : ''}`}
                onClick={() => setExpandedCard(expandedCard === 'owed' ? null : 'owed')}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="balance-label">You Are Owed</span>
                  <TrendingUp color="var(--success)" />
                </div>
                <div className="balance-value">₹{totalOwedToYou.toLocaleString()}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {expandedCard === 'owed' ? "Click to collapse" : "Pending from your groups • Click to expand"}
                </p>
                {expandedCard === 'owed' && <BalanceDetailList type="owed" />}
              </div>
            </div>

            <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.75rem", fontFamily: 'Outfit' }}>Recent Activity</h3>
              <button className="btn btn-primary" onClick={() => setActiveView("activity")}>
                View All
              </button>
            </div>

            <RecentActivity token={token} refreshTrigger={refreshTrigger} />
          </>
        )}
      </main>
    </div>
  );
}
