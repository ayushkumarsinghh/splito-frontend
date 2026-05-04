import React from "react";

export default function Landing({ setPage }) {
  const previewImage = "/dashboard_preview.png";

  return (
    <div className="landing-page fade-in">
      {/* 🏠 Navigation */}
      <nav className="landing-nav">
        <div className="logo">Splito</div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span 
            className="footer-link" 
            style={{ cursor: "pointer", fontWeight: 500 }} 
            onClick={() => setPage("login")}
          >
            Login
          </span>
          <button className="btn btn-primary" onClick={() => setPage("signup")} style={{ padding: "8px 20px" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Shared expenses, finally simplified.</h1>
          <p className="hero-subtitle">
            The most clear-cut way to split bills, track balances, and settle debts with friends.
          </p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => setPage("signup")}>
              Start Free
            </button>
            <button className="btn btn-secondary" onClick={() => setPage("login")}>
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* 🖥️ Product Preview */}
      <section className="product-preview">
        <div className="preview-container">
          <img src={previewImage} alt="Splito Dashboard Preview" />
        </div>
      </section>

      {/* 🛠️ How it Works - Redesigned 3-Card Grid */}
      <section className="features-section">
        <div style={{ marginBottom: "var(--s-64)" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "var(--s-16)" }}>How Splito works</h2>
          <p className="text-secondary">Three steps to total financial clarity.</p>
        </div>
        
        <div className="features-grid">
          {/* Step 1: Add Expense */}
          <div className="card feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <h3>Add Expense</h3>
            <p>Log any cost, from dinner to rent, and assign it to a group or friend instantly.</p>
          </div>

          {/* Step 2: Split Automatically */}
          <div className="card feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h3>Split Automatically</h3>
            <p>Our engine handles the math. Choose equal splits or custom amounts in seconds.</p>
          </div>

          {/* Step 3: Track Balances */}
          <div className="card feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <h3>Track Balances</h3>
            <p>See real-time summaries of who owes what and settle up with one click.</p>
          </div>
        </div>
      </section>

      {/* 👣 Professional Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: "var(--s-8)" }}>Splito</div>
            <p className="footer-tagline">Built for financial clarity and seamless group settlements.</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/ayushkumarsinghh" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Splito. Made by Ayush Kumar Singh.</p>
        </div>
      </footer>
    </div>
  );
}
