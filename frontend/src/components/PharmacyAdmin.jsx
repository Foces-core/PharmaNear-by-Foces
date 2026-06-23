import { useEffect, useState } from "react";
import { FaArrowLeft, FaMapPin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./PharmacyAdmin.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

export default function PharmacyAdmin() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    user_name: "",
    license_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    location_url: "",
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.tagName === 'INPUT') {
        e.preventDefault();
      }
    };
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.add('no-wheel-input');
      input.addEventListener('wheel', handleWheel, { passive: false });
    });
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('wheel', handleWheel);
      });
    };
  }, []);

  const [savingProfile, setSavingProfile] = useState(false);
  const [originalUserName, setOriginalUserName] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("pharmacy_user_name") || "";
    const token = localStorage.getItem("pharmacy_token") || "";
    if (!userName || !token) {
      navigate('/login');
      return;
    }
    setProfile((p) => ({ ...p, user_name: userName }));
    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  async function fetchProfile(signal) {
    try {
      const userName = localStorage.getItem("pharmacy_user_name") || "";
      const token = localStorage.getItem("pharmacy_token") || "";
      const res = await fetch(
        `${BACKEND_URL}/api/pharmacy/profile?user_name=${encodeURIComponent(userName)}`, {
          signal,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      const fetchedUserName = data.user_name || userName;
      setOriginalUserName(fetchedUserName);
      setProfile((p) => ({
        ...p,
        user_name: fetchedUserName,
        license_number: data.license_number || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        latitude: data.latitude ?? "",
        longitude: data.longitude ?? "",
        location_url: data.location_url || "",
      }));
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error("Failed to load profile:", e);
        if (e.message.includes('401') || e.message.includes('403')) {
          localStorage.clear();
          navigate('/login');
        }
      }
    }
  }

  async function saveProfile() {
    try {
      setSavingProfile(true);
      setSaveError("");
      const token = localStorage.getItem("pharmacy_token") || "";
      // Track if user_name is being changed
      const userNameChanged = profile.user_name !== originalUserName;
      
      const payload = {
        ...profile,
        // Always send the original user_name for authentication verification
        user_name: originalUserName,
        latitude:
          profile.latitude === "" ? undefined : Number(profile.latitude),
        longitude:
          profile.longitude === "" ? undefined : Number(profile.longitude),
      };
      // If user_name changed, send the new name as new_user_name
      if (userNameChanged) {
        payload.new_user_name = profile.user_name;
      }
      const res = await fetch(`${BACKEND_URL}/api/pharmacy/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save");
      }
      const data = await res.json();
      const updatedUserName = data.pharmacy.user_name || profile.user_name;
      
      // If username was changed, logout and redirect to login
      if (userNameChanged) {
        // Clear all local storage
        localStorage.clear();
        // Show a brief message before redirecting

        // Navigate to login page
        navigate('/login');
        return;
      }
      
      // If username didn't change, update state normally
      setOriginalUserName(updatedUserName);
      setProfile((p) => ({
        ...p,
        ...data.pharmacy,
        user_name: updatedUserName,
        latitude: data.pharmacy.latitude ?? "",
        longitude: data.pharmacy.longitude ?? "",
        location_url: data.pharmacy.location_url || "",
      }));
      console.log("Profile saved:", data);
      setSaveError("");
      window.location.reload();
    } catch (e) {
      console.error("Unable to save profile:", e);
      setSaveError(e.message || "Unable to save profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }

  function fetchCurrentLocation() {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setProfile((p) => ({ ...p, latitude, longitude }));
      },
      () => {
        console.error("Unable to fetch location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="find-medicine-page">
      {/* Header */}
      <header className="fm-header">
        <div className="fm-text" style={{ color: '#ffffff', marginTop: 1, fontWeight: 'bold', textShadow: '0 2px 4px rgba(0, 0, 0, 0.33)' }}>PharmaNear</div>
        <div className="fm-location">
          <h6 className="fm-welcome-text">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg><span className="user-name">{profile.user_name}</span>
          </h6>
        </div>
      </header>

      <div className="back-to-dashboard-container" style={{background:'transparent'}}>
        <button
          type="button"
          className="fm-search-btn back-btn"
          onClick={() => navigate("/pharmacy")}
          style={{ backgroundColor: "#14967f", width: 200, marginLeft: -15, color: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',fontWeight: '600' }}
        >
          <FaArrowLeft />Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <main className="fm-main">
        <div className="fm-grid">
          <div className="fm-col">
            <div className="admin-section">
              <h3>Pharmacy Profile</h3>
              <form
                className="profile-form"
                autoComplete="on"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile();
                }}
              >
                <div className="admin-cards-wrapper">
                  {/* First Card - Pharmacy Name, License Number and Address */}
                  <div className="admin-card profile-card license-address-card">
                    <label htmlFor="user_name">Pharmacy Name *</label>
                    <input
                      id="user_name"
                      type="text"
                      className="fm-input"
                      placeholder="Enter pharmacy name"
                      value={profile.user_name}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          user_name: e.target.value,
                        }))
                      }
                      required
                    />
                    <label htmlFor="license_number">License Number *</label>
                    <input
                      id="license_number"
                      type="text"
                      className="fm-input"
                      placeholder="Enter your pharmacy license number"
                      value={profile.license_number}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          license_number: e.target.value,
                        }))
                      }
                      required
                    />
                    <label htmlFor="address">Address</label>
                    <input
                      id="address"
                      type="text"
                      className="fm-input"
                      placeholder="Enter full address"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, address: e.target.value }))
                      }
                      style={{ minHeight: '3.5em' }} 
                    />
                    
                  </div>

                  {/* Second Card - City, State, Pincode */}
                  <div className="admin-card profile-card city-state-card">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      className="fm-input"
                      placeholder="Enter city"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, city: e.target.value }))
                      }
                    />
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      type="text"
                      className="fm-input"
                      placeholder="Enter state"
                      value={profile.state}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, state: e.target.value }))
                      }
                    />
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      id="pincode"
                      type="text"
                      className="fm-input"
                      placeholder="Enter postal code"
                      value={profile.pincode}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, pincode: e.target.value }))
                      }
                    />
                  </div>

                  {/* Third Card - Latitude, Longitude, Location URL, Use Current Location Button */}
                  <div className="admin-card profile-card coordinates-card">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      className="fm-input no-spinner"
                      placeholder="GPS latitude"
                      value={profile.latitude}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, latitude: e.target.value }))
                      }
                      style={{ overflow: 'hidden' }}
                    />
                    <label htmlFor="longitude">Longitude</label>
                    <input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      className="fm-input no-spinner"
                      placeholder="GPS longitude"
                      value={profile.longitude}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, longitude: e.target.value }))
                      }
                      style={{ overflow: 'hidden' }}
                    />
                    
                    <button
                      type="button"
                      className="fm-search-btn save-btn"
                      onClick={fetchCurrentLocation}
                    >
                      <FaMapPin /> Use current location
                    </button>
                    <label htmlFor="location_url">Location URL</label>
                    <input
                      id="location_url"
                      type="url"
                      className="fm-input"
                      placeholder="https://maps.google.com/..."
                      value={profile.location_url}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, location_url: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {saveError && (
                  <div style={{ 
                    color: "#dc2626", 
                    background: "#fee2e2", 
                    borderRadius: "6px", 
                    padding: "12px", 
                    marginBottom: "16px",
                    fontSize: "0.95rem"
                  }}>
                    {saveError}
                  </div>
                )}
                <button
                  className="fm-search-btn save-btn"
                  type="submit"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="fm-footer">
        <div className="fm-footer-links">
          <Link to="/">About Us</Link>
          <Link to="/">Services</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
