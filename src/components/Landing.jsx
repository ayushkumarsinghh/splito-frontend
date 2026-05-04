import React from "react";
import { 
  Zap, 
  Shield, 
  Activity, 
  ArrowRight, 
  ChevronRight,
  Globe
} from "lucide-react";

export default function Landing({ setPage }) {
  const previewImage = "/dashboard_preview.png";

  return (
    <div className="landing-page fade-in">
      {/* 🏠 Navigation */}
      <nav className="landing-nav">
        <div className="logo-container" style={{ margin: 0 }}>
          <div className="logo-icon">S</div>
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
          <h1>Shared expenses,<br />finally simplified.</h1>
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

      {/* 🛠️ Features Section */}
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
            <div className="logo-icon">S</div>
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
