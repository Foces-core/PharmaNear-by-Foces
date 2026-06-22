import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>The page you're looking for doesn't exist or may have been moved.</p>

        <Link to="/">
          <button className="home-btn">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
