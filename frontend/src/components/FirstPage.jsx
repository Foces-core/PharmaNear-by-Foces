import { useState } from "react";
import { FaCapsules, FaSearch, FaSortNumericUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./FirstPage.css";
import Header from "./Header";
import Footer from "./Footer";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

function FindMedicine() {
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // PREFETCH PATTERN: Triggers browser to download MapPage code bundle in the background
  // PREFETCH PATTERN: Triggers browser to download MapPage code bundle in the background
  const handlePrefetchMap = () => {
    import("./MapPage.jsx").catch(() => {});
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locString = `${latitude}, ${longitude}`;
            setLocation(locString);
            setError("");
            resolve(locString);
          },
          (error) => {
            console.warn("Geolocation denied or failed:", error.message);
            resolve("10.001, 76.320"); // Fallback to default
          },
          { timeout: 5000 },
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        resolve("10.001, 76.320"); // Fallback to default
      }
    });
  };

  const handleSearch = async () => {
    if (!medicine) {
      setError("Please enter a medicine name");
      return;
    }

    setError(""); // Clear previous errors

    try {
      setLoading(true);
      let currentLocation = location;
      if (!currentLocation) {
        currentLocation = await getLocation();
      }

      const response = await fetch(
        `${BACKEND_URL}/api/drugs?name=${encodeURIComponent(medicine)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("API response was not ok");
      }

      const data = await response.json();
      navigate("/mappage", {
        state: {
          medicineData: data,
          medicine: medicine,
          dosage: dosage,
          quantity: quantity,
          userLocation: currentLocation,
        },
      });
    } catch (error) {
      console.error("Error fetching medicine data:", error);
      setError("Failed to fetch medicine data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="find-medicine-page">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="fm-main">
        <h2 className="fm-title">Find Your Medicine</h2>

        <div className="fm-input-group relative">
          <FaSearch className="fm-icon" style={{ color: "#14967f" }} />
          <input
            type="text"
            placeholder="Search for medicines & health products"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            onFocus={handlePrefetchMap} // <--- Triggers optimization when user prepares to type
            className="fm-input with-icon"
          />
        </div>

        <div
          className="flexrow"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "800px",
            maxWidth: "100%",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          <div
            className="fm-input-groups relative"
            style={{ position: "relative", flex: 1 }}
          >
            <FaCapsules className="fm-icon" style={{ color: "#14967f" }} />
            <input
              type="text"
              placeholder="Dosage/Strength"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              onFocus={handlePrefetchMap} // <--- Also prefetch if they jump to dosage options first
              className="fm-input with-icon"
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            className="fm-input-groups relative"
            style={{ position: "relative", flex: 1 }}
          >
            <FaSortNumericUp className="fm-icon" style={{ color: "#14967f" }} />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="fm-input with-icon"
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "10px" }}
          >
            {error}
          </p>
        )}
        <button
          className="fp-search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching ..." : "Search Nearby"}
        </button>
        <div className="fm-register">
          <span>Register medicine?</span>
          <Link to="/login">Login</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FindMedicine;