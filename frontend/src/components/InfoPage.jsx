import { Link } from "react-router-dom";
import "./FirstPage.css";
import "./InfoPage.css";

function InfoPage({ title, content }) {
  return (
    <div className="info-page">
      {/* Header */}
      <header className="fm-header">
        <h1 className="fm-text">PharmaNear</h1>
      </header>

      {/* Main Content */}
      <main className="info-content">
        <h1 className="info-title">{title}</h1>

        <div className="info-text">{content}</div>

        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </main>

      {/* Footer */}
      <footer className="fm-footer">
        <div className="fm-footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

export default InfoPage;