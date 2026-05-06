import React from "react";
import { 
  Zap, 
  Shield, 
  Activity, 
  ChevronRight,
  Globe,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Landing({ setPage }) {
  const previewImage = "/dashboard_preview.png";

  return (
    <div className="landing-page fade-in">
      {/* 🏠 Navigation */}
      <nav className="landing-nav">
        <div className="logo-container" style={{ margin: 0 }}>
          <img src={logoImg} alt="Splito Logo" className="logo-img" />
          <div className="logo-text">Splito</div>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span 
            className="footer-link" 
            style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" }} 
            onClick={() => setPage("login")}
          >
            Login
          </span>
          <button 
            className="btn btn-primary" 
            onClick={() => setPage("signup")}
            style={{ padding: "10px 20px" }}
          >
            Get Started
            <ChevronRight size={16} style={{ marginLeft: "6px" }} />
          </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "8px 16px", 
            background: "var(--primary-glow)", 
            borderRadius: "100px", 
            color: "var(--primary)", 
            fontSize: "0.85rem", 
            fontWeight: 600,
            marginBottom: "32px",
            border: "1px solid rgba(99, 102, 241, 0.2)"
          }}>
            <Globe size={14} />
            <span>Now in Early Access</span>
          </div>
          <h1 style={{ maxWidth: "900px", margin: "0 auto 24px" }}>Manage expenses,<br />with total clarity.</h1>
          <p className="hero-subtitle">
            The most clear-cut way to split bills, track balances, and settle debts with friends—all in one premium dashboard.
          </p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => setPage("signup")} style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              Start for Free
            </button>
            <button className="btn btn-outline" onClick={() => setPage("login")} style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              View Live Demo
            </button>
          </div>

          {/* 🖥️ Product Preview */}
          <div className="preview-container fade-in" style={{ 
            marginTop: "80px", 
            borderRadius: "24px", 
            padding: "10px", 
            background: "rgba(255,255,255,0.03)", 
            border: "1px solid var(--border)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            maxWidth: "1000px",
            margin: "0 auto",
            position: "relative"
          }}>
            <img 
              src={previewImage} 
              alt="Dashboard Preview" 
              style={{ 
                width: "100%", 
                borderRadius: "16px", 
                display: "block",
                border: "1px solid rgba(255,255,255,0.05)"
              }} 
            />
          </div>
        </div>
      </section>

      {/* 📊 Feature Showcase (Cards from Dashboard) */}
      <section style={{ padding: "80px 8%", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
           <h2 style={{ fontSize: "2.5rem", fontFamily: 'Outfit', fontWeight: 800, marginBottom: "16px" }}>Financial overview at a glance</h2>
           <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Keep track of every rupee without the headache.</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div className="balance-card owe-card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>You Owe</span>
              <TrendingDown size={20} color="var(--danger)" />
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: 'Outfit' }}>₹1,240</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "8px" }}>Total debts across 3 groups</p>
          </div>

          <div className="balance-card owed-card" style={{ padding: "32px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>You are owed</span>
              <TrendingUp size={20} color="var(--success)" />
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: 'Outfit' }}>₹3,500</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "8px" }}>Total pending settlements</p>
          </div>
        </div>
      </section>

      {/* 🛠️ Features Grid */}
      <section className="features-section" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "2.5rem", fontFamily: 'Outfit', fontWeight: 800, marginBottom: "16px" }}>Everything you need</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Three steps to total financial clarity.</p>
        </div>
        
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">
              <Zap size={24} />
            </div>
            <h3>Quick Entry</h3>
            <p>Log any cost, from dinner to rent, and assign it to a group or friend instantly with our optimized entry system.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <Shield size={24} />
            </div>
            <h3>Settle Securely</h3>
            <p>Our settlement engine handles the math perfectly. Choose equal splits or custom amounts with one click.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <Activity size={24} />
            </div>
            <h3>Deep Insights</h3>
            <p>Track real-time balances and historical trends to see exactly where your money goes across all your groups.</p>
          </div>
        </div>
      </section>

      {/* 👣 Footer */}
      <footer className="footer">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div className="logo-container" style={{ justifyContent: "center", margin: "0 0 24px 0" }}>
            <img src={logoImg} alt="Splito Logo" className="logo-img" />
            <div className="logo-text">Splito</div>
          </div>
          <p style={{ color: "var(--text-secondary)", maxWidth: "400px", margin: "0 auto" }}>
            Built for financial clarity and seamless group settlements.
          </p>
        </div>
        <div className="footer-bottom" style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <p>© 2026 Splito. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
