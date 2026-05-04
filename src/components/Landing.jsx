import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  ChevronRight,
  Github
} from "lucide-react";

export default function Landing({ setPage }) {
  const previewImage = "/dashboard_preview.png";

  return (
    <div className="landing-page fade-in">
      {/* 🏠 Navigation */}
      <nav className="landing-nav">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <div className="logo-text">Splito</div>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span 
            className="footer-link" 
            style={{ cursor: "pointer", fontWeight: 500 }} 
            onClick={() => setPage("login")}
          >
            Login
          </span>
          <button className="btn btn-primary" onClick={() => setPage("signup")}>
            Get Started
            <ChevronRight size={18} style={{ marginLeft: "4px" }} />
          </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Shared expenses, finally simplified.</h1>
          <p className="hero-subtitle">
            The most clear-cut way to split bills, track balances, and settle debts with friends—all in one premium dashboard.
          </p>
          <div className="hero-btns" style={{ marginBottom: "64px" }}>
            <button className="btn btn-primary" onClick={() => setPage("signup")} style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              Start for Free
            </button>
            <button className="btn btn-outline" onClick={() => setPage("login")} style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              View Live Demo
            </button>
          </div>

          {/* 🖥️ Product Preview */}
          <div className="preview-container fade-in" style={{ 
            marginTop: "40px", 
            borderRadius: "24px", 
            padding: "12px", 
            background: "rgba(255,255,255,0.05)", 
            border: "1px solid var(--border)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
            maxWidth: "1100px",
            margin: "0 auto"
          }}>
            <img 
              src={previewImage} 
              alt="Dashboard Preview" 
              style={{ 
                width: "100%", 
                borderRadius: "16px", 
                display: "block"
              }} 
            />
          </div>
        </div>
      </section>

      {/* 🛠️ Features Section */}
      <section className="features-section">
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "3rem", fontFamily: 'Outfit', marginBottom: "16px" }}>Everything you need</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Three steps to total financial clarity.</p>
        </div>
        
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">
              <Zap size={28} />
            </div>
            <h3>Quick Entry</h3>
            <p>Log any cost, from dinner to rent, and assign it to a group or friend instantly with our optimized entry system.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <ShieldCheck size={28} />
            </div>
            <h3>Settle Securely</h3>
            <p>Our settlement engine handles the math perfectly. Choose equal splits or custom amounts with one click.</p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <BarChart3 size={28} />
            </div>
            <h3>Deep Insights</h3>
            <p>Track real-time balances and historical trends to see exactly where your money goes across all your groups.</p>
          </div>
        </div>
      </section>

      {/* 👣 Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-container" style={{ marginBottom: "16px" }}>
              <div className="logo-icon">S</div>
              <div className="logo-text">Splito</div>
            </div>
            <p style={{ color: "var(--text-secondary)", maxWidth: "300px" }}>
              Built for financial clarity and seamless group settlements.
            </p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/ayushkumarsinghh" target="_blank" rel="noopener noreferrer" className="footer-link">
              <Github size={20} style={{ marginRight: "8px" }} />
              GitHub
            </a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
          </div>
        </div>
        <div className="footer-bottom" style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          <p>© 2026 Splito. Made with ❤️ by Ayush Kumar Singh.</p>
          <p>Version 2.0.0 (Premium Upgrade)</p>
        </div>
      </footer>
    </div>
  );
}
