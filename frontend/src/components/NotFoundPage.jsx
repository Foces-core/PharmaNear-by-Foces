import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCapsules } from "react-icons/fa";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="animated-icon-container">
          <FaCapsules className="floating-capsule c1" />
          <FaCapsules className="floating-capsule c2" />
          <div className="error-code">404</div>
        </div>
        <h1 className="not-found-title">Lost in the Pharmacy?</h1>
        <p className="not-found-text">
          We couldn't find the page you were looking for. 
        </p>
        <Link to="/" className="home-button">
          <FaHome className="home-icon" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
