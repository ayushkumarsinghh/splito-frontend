import { useEffect } from "react";

export default function Landing({ setPage }) {
  return (
    <div className="landing-container fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <nav className="landing-navbar">
            <div className="landing-logo">Splito</div>
            <div className="landing-nav-links">
              <span onClick={() => setPage("login")}>Login</span>
              <button className="btn-nav" onClick={() => setPage("signup")}>Sign Up</button>
            </div>
          </nav>
          
          <div className="hero-main">
            <h1 className="hero-title">SPLIT EXPENSES<br/>WITH EASE</h1>
            <p className="hero-subtitle">
              The smartest way to track balances and settle up with your friends. 
              No more awkward "you owe me" texts.
            </p>
            <button className="btn-hero" onClick={() => setPage("signup")}>
              START SPLITTING
            </button>
          </div>
        </div>
      </section>

      {/* USP Banner */}
      <div className="usp-banner">
        <h2>Includes tracking for all your group trips and dinners</h2>
        <div className="usp-capsule">Seamless Settlements</div>
      </div>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">WHY CHOOSE SPLITO?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-img-wrapper">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" alt="Group" />
            </div>
            <h3>Group Trips</h3>
            <p>Perfect for tracking shared expenses during vacations and getaways.</p>
          </div>
          <div className="feature-card">
            <div className="feature-img-wrapper">
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" alt="Dinner" />
            </div>
            <h3>Dinners out</h3>
            <p>Split the bill exactly as it should be without the headache.</p>
          </div>
          <div className="feature-card">
            <div className="feature-img-wrapper">
              <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80" alt="Finance" />
            </div>
            <h3>Clear Balances</h3>
            <p>Always know exactly who owes who, summarized perfectly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title text-dark">WHAT OUR USERS SAY</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <span className="quote-icon">"</span>
            <p>"Splito saved our Europe trip. It handled multiple currencies and complex splits effortlessly."</p>
            <h4>- Sarah J.</h4>
          </div>
          <div className="testimonial-card">
            <span className="quote-icon">"</span>
            <p>"I use it for my roommates. We just log our groceries and settle up at the end of the month."</p>
            <h4>- Mike T.</h4>
          </div>
          <div className="testimonial-card">
            <span className="quote-icon">"</span>
            <p>"The best UI I've seen for a finance app. Simple, bold, and gets the job done."</p>
            <h4>- Alex R.</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h3>Splito</h3>
            <p>Making money between friends simple.</p>
          </div>
          <div className="footer-col">
            <h4>Social</h4>
            <p>Instagram</p>
            <p>Twitter</p>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>hello@splito.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
