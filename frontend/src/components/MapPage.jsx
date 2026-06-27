import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Link, useLocation } from "react-router-dom";
import "./MapPage.css";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

const fallbackPharmacies = [
  {
    id: "fallback-no-results",
    name: "No pharmacies found",
    address: "Try searching for a different medicine",
    closing: "N/A",
    phone: "N/A",
    lat: 9.449826,
    lng: 76.670144,
    stock: "out-of-stock",
    price: 0,
    quantity: 0,
  },
];

const shadowUrl = "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-shadow.png";

const userIcon = new L.Icon({
    iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-blue.png",
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const pharmacyIcon = new L.Icon({
    iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png",
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Removed PharmacyFilter to keep list stable
function Routing({ userLocation, selectedPharmacy }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (!map || !selectedPharmacy) return;

    // Pan to the selected pharmacy
    map.flyTo(L.latLng(selectedPharmacy.lat, selectedPharmacy.lng), 15, {
        animate: true,
        duration: 1.5
    });

    // Remove old route
    map.eachLayer((layer) => {
      if (layer instanceof L.Routing.Control) {
        map.removeControl(layer);
      }
    });

    // Add new route
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(selectedPharmacy.lat, selectedPharmacy.lng),
      ],
      routeWhileDragging: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      createMarker: () => null, // hide duplicate markers
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, selectedPharmacy]);

  return null;
}


// ---------------------
// Main Component
// ---------------------
export default function MapPage() {
    const location = useLocation();
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);

    
    const locationState = location.state || {};
    const storedData = JSON.parse(sessionStorage.getItem('mapPageData') || '{}');
    const medicineData = locationState.medicineData || storedData.medicineData;
    const medicine = locationState.medicine || storedData.medicine;
    const dosage = locationState.dosage || storedData.dosage;
    const passedLocation = locationState.userLocation || storedData.userLocation;
    
    useEffect(() => {
        if (location.state) {
            sessionStorage.setItem('mapPageData', JSON.stringify({
                medicineData: medicineData,
                medicine: medicine,
                dosage: dosage,
                userLocation: passedLocation
            }));
        }
    }, [location.state, medicineData, medicine, dosage, passedLocation]);

    const initialLocation = passedLocation
        ? {
            lat: parseFloat(passedLocation.split(',')[0]) || 10.001,
            lng: parseFloat(passedLocation.split(',')[1]) || 76.320
        }
        : { lat: 10.001, lng: 76.320 };

    const [userLocation, setUserLocation] = useState(initialLocation);
    const [pharmacies, setPharmacies] = useState([]);

    useEffect(() => {
        if (medicineData?.stocks?.length > 0) {
            try {
              const pharmacyList = medicineData.stocks.map((item) => {
                const pharmacy = item.pharmacy;

                if(!pharmacy || typeof pharmacy === 'string') {
                  return null
                }

                const addressParts = []
                if(pharmacy.address) addressParts.push(pharmacy.address);
                if(pharmacy.city) addressParts.push(pharmacy.city);
                if(pharmacy.state) addressParts.push(pharmacy.state);
                if(pharmacy.pincode) addressParts.push(pharmacy.pincode);
                const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : "Address not available";
                
                return {
                    id: pharmacy?._id || `unknown-${Math.random()}`,
                    name: pharmacy?.user_name || "Unknown Pharmacy",
                    address: fullAddress,
                    closing: pharmacy?.closing_hours || "Not specified",
                    phone: pharmacy?.phone_number || "Not available",
                    lat: pharmacy?.latitude != null ? pharmacy.latitude : userLocation.lat + Math.random() * 0.01,
                    lng: pharmacy?.longitude != null ? pharmacy.longitude : userLocation.lng + Math.random() * 0.01,
                    location_url: pharmacy?.location_url || null,
                    stock: item?.stock?.quantity > 0 ? "in-stock" : "out-of-stock",
                    price: item?.stock?.price || 0,
                    quantity: item?.stock?.quantity || 0,
                };
              });

              const validPharmacies = pharmacyList.filter(p => p !== null);
              setPharmacies(validPharmacies.length ? validPharmacies : fallbackPharmacies);
            }
            catch(error) {
              console.error("Error fetching pharmacy details:", error);
              return null
            }
        } else {
            setPharmacies(fallbackPharmacies);
        }
    }, [medicineData, userLocation.lat, userLocation.lng]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }),
                (err) => console.warn("Geolocation error:", err)
            );
        }
    }, []);

    return (
        <div className="find-medicine-page">
            {/* Header */}
            <header className="fm-header">
                <h6 className="fm-text">PharmaNear</h6>
            </header>
            {/* Main Content */}
<main className="fm-main">
  <div className="content-wrapper">
    {/* Left Panel */}
    <div className="left-panel">
      {medicine && (
        <h3 className="medicine-title">
          Showing results for: {medicine} {dosage && `(${dosage})`}
        </h3>
      )}

      {/* Scrollable container for pharmacy cards */}
      <div className="pharmacy-list-scroll">
        {pharmacies.length > 0 ? (
          pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="pharmacy-card" onClick={() => setSelectedPharmacy(pharmacy)} style={{ cursor: 'pointer' }}>
              <div className="pharmacy-info">
                <h3>{pharmacy.name}</h3>
                <p>Address: {pharmacy.address}</p>
                <p>Closes: {pharmacy.closing}</p>
                <p>Phone: {pharmacy.phone}</p>
                {pharmacy.price > 0 && <p>Price: ₹{pharmacy.price}</p>}

                <button
                  className="google-maps-btn"
                  onClick={() => {
                    const mapsUrl = pharmacy.location_url 
                      ? pharmacy.location_url 
                      : `https://www.google.com/maps?q=${pharmacy.lat},${pharmacy.lng}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  title="Open in Google Maps"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                </button>
              </div>
              <div className={`stock ${pharmacy.stock}`}>
                {pharmacy.stock === "in-stock" ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          ))
        ) : (
          <div className="no-pharmacies-message">
            No pharmacies available in this area.
          </div>
        )}
      </div>
    </div>


                    {/* Right Panel - Map */}
                    <div className="right-panel">
                        <MapContainer
                            center={[userLocation.lat, userLocation.lng]}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
                            >
                            {/* ✅ OpenStreetMap Tiles */}
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* ✅ User Location Marker */}
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                <Popup>Your Location</Popup>
                            </Marker>

                            {/* ✅ Pharmacy Markers */}
                            {pharmacies.map((p) => (
                                <Marker key={p.id} position={[p.lat, p.lng]} icon={pharmacyIcon}>
                                <Popup>
                                    <b>{p.name}</b>
                                    <br />
                                    {p.address}
                                    <br />
                                    <span
                                    className={p.stock === "in-stock" ? "in-stock-text" : "out-of-stock-text"}
                                    >
                                    {p.stock === "in-stock" ? "In Stock" : "Out of Stock"}
                                    </span>
                                    {p.price > 0 && (
                                    <>
                                        <br />
                                        Price: ₹{p.price}
                                    </>
                                    )}
                                    <br />
                                    
                                </Popup>
                                </Marker>
                            ))}

                            {/* Removed PharmacyFilter so list is always visible */}

                            {/* ✅ Routing Component */}
                            <Routing userLocation={userLocation} selectedPharmacy={selectedPharmacy} />
                        </MapContainer>

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
