import { useEffect, useState } from "react";
import { FaCapsules, FaDollarSign, FaEdit, FaPlus, FaSave, FaSortNumericUp, FaTrash, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import "./PharmacyPage.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

export default function PharmacyPage() {
  const navigate = useNavigate();
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [strength, setStrength] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    user_name: "",
    license_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!medicineName || quantity === "" || price === "") return;
    const newItem = {
      id: crypto.randomUUID(),
      name: medicineName.trim(),
      quantity: Number(quantity),
      price: Number(price),
    };

    try {
      const token = localStorage.getItem('pharmacy_token');
      if (!token) {
        throw new Error('No token provided');
      }
      
      const response = await fetch(`${BACKEND_URL}/api/pharmacy/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pharmacy_id: localStorage.getItem('pharmacy_id'),
          medicine_name: newItem.name,
          quantity: newItem.quantity,
          price: newItem.price,
          strength: strength
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Add medicine failed');
      }

      await response.json()
      setStockItems((prev) => [newItem, ...prev]);
      setMedicineName("");
      setQuantity("");
      setPrice("");
      setStrength("");
      setError("");
    } catch (error) {
      setError(error.message)
      if (error.message === 'No token provided') {
        
        navigate('/login');
      }
    }
  }

  function startEditing(item) {
    setEditingItem({ ...item });
  }

  function cancelEditing() {
    setEditingItem(null);
  }

  async function saveEditing() {
    try {
      const token = localStorage.getItem('pharmacy_token');
      if (!token) {
        throw new Error('No token provided');
      }
      
      const response = await fetch(`${BACKEND_URL}/api/pharmacy/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pharmacy_id: localStorage.getItem('pharmacy_id'),
          medicine_name: editingItem.name,
          quantity: editingItem.quantity,
          price: editingItem.price,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Update medicine failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await response.json()
      const updatedStock = stockItems.map(item => 
        item.name === editingItem.name ? { ...item, quantity: editingItem.quantity, price: editingItem.price } : item
      );
      setStockItems(updatedStock);
      setEditingItem(null);
      
    } catch (error) {
      setError(error.message)
      if (error.message === 'No token provided') {
      
        navigate('/login');
      }
    }
  }

  async function deleteItem(id) {
      try {
        const item = stockItems.find(item => item.id === id);
        if (!item) {
          throw new Error('Medicine not found');
        }
        
        const token = localStorage.getItem('pharmacy_token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(`${BACKEND_URL}/api/pharmacy/stock`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            pharmacy_id: localStorage.getItem('pharmacy_id'),
            medicine_name: item.name,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Delete medicine failed';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        await response.json()
        const updatedStock = stockItems.filter(item => item.id !== id);
        setStockItems(updatedStock);
        
      } catch (error) {
        setError(error.message)
        if (error.message === 'No token provided') {
          
          navigate('/login');
        }
      }
  }

  function totalItems() {
    return stockItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  function goToAdmin() {
    navigate('/pharmacy/admin');
  }

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const userName = localStorage.getItem('pharmacy_user_name') || '';
    const token = localStorage.getItem('pharmacy_token') || '';
    const pharmacyId = localStorage.getItem('pharmacy_id') || '';
    if (!userName || !token || !pharmacyId) {
      navigate('/login');
      return;
    }
    setProfile((p) => ({ ...p, user_name: userName }));
    const controller = new AbortController();

    async function fetchProfile() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/pharmacy/profile?user_name=${encodeURIComponent(userName)}`, {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile((p) => ({
          ...p,
          user_name: data.user_name || userName,
          license_number: data.license_number || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
        }));
      } catch (e) {
        if (e.name !== 'AbortError') {
          if (e.message.includes('401') || e.message.includes('403')) {
            localStorage.clear();
            navigate('/login');
          }
        }
      }
    }

    async function fetchStock() {
      try {
        setLoading(true);
        const res = await fetch(
          `${BACKEND_URL}/api/pharmacy/stock?pharmacy_id=${encodeURIComponent(pharmacyId)}`,
          {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to load stock data');
        }
        const data = await res.json();
        if (data.medications && Array.isArray(data.medications)) {
          const formattedStockItems = data.medications.map((med, index) => ({
            id: `med-${index}-${Date.now()}`,
            name: med.medicine_id && med.medicine_id.name ? med.medicine_id.name : 'Unknown Medicine',
            quantity: med.quantity,
            price: med.price,
          }));
          setStockItems(formattedStockItems);
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Failed to load stock data');
          if (e.message.includes('401') || e.message.includes('403')) {
            localStorage.clear();
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    }

    Promise.all([fetchProfile(), fetchStock()]);
    return () => {
      controller.abort();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  return (
    <div className="medicine-page">
      <header className="fm-header">
        <h6 className="fm-text">PharmaNear</h6>
        <div className="fm-location">
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            className="profile-button"
            aria-label="Profile menu"
          >
            <FaUserCircle className="profile-icon" />
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={goToAdmin} className="dropdown-item">
                Go to Admin Panel
              </button>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="pharmacy-main">
        <div className="pharmacy-main-top">
          {/* Left: Summary Cards */}
          <div className="pharmacy-summary-cards">
            <div className="pharmacy-summary-card">
              <div className="summary-value">{stockItems.length}</div>
              <div className="summary-label">Total Medicines</div>
            </div>
            <div className="pharmacy-summary-card">
              <div className="summary-value">{totalItems()}</div>
              <div className="summary-label">Total Quantity</div>
            </div>
            <div className="pharmacy-summary-card">
              <div className="summary-value">₹{stockItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</div>
              <div className="summary-label">Total Value</div>
            </div>
          </div>
          {/* Right: Welcome + Add Medicine Card */}
          <div className="pharmacy-add-card">
            <h2 className="pharmacy-welcome">Welcome {profile.user_name}</h2>
            <h3 className="pharmacy-add-title">Add Medicine To Stock</h3>
            <form onSubmit={handleAdd} className="pharmacy-add-form">
              <div className="fm-input-groups relative">
                <FaCapsules className="fm-icon" style={{ color: "#14967f" }} />
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="fm-input with-icon"
                  required
                />
              </div>
              <div className="fm-input-groups relative">
                <FaSortNumericUp className="fm-icon" style={{ color: "#14967f" }} />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="fm-input with-icon"
                  min="0"
                  required
                />
              </div>
              <div className="fm-input-groups relative">
                <FaDollarSign className="fm-icon" style={{ color: "#14967f" }} />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="fm-input with-icon"
                  min="0"
                  required
                />
              </div>
              <div className="fm-input-groups relative">
                <FaCapsules className="fm-icon" style={{ color: "#14967f" }} />
                <input
                  type="text"
                  placeholder="Strength (optional, e.g., 500mg)"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="fm-input with-icon"
                />
              </div>
              <button className="fm-search-btn" type="submit">
                <FaPlus style={{ marginRight: 8 }} /> Add To Stock
              </button>
            </form>
            {error && <div className="pharmacy-error">{error}</div>}
          </div>
        </div>
        {/* Table below both sections */}
        <div className="pharmacy-table-section">
          <div style={{ 
            background: "#fff", 
            borderRadius: "12px", 
            overflow: "hidden", 
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            marginBottom: "200px"
          }}>
            {/* Table Header */}
            <div style={{ 
              display: isMobile ? "none" : "grid", 
              gridTemplateColumns: "2fr 1fr 1fr 1fr", 
              padding: "16px 20px", 
              background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#4a5568",
              borderBottom: "2px solid #e2e8f0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCapsules style={{ color: "#00664c" }} />
                Medicine Name
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaSortNumericUp style={{ color: "#00664c" }} />
                Quantity
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaDollarSign style={{ color: "#00664c" }} />
                Price (₹)
              </div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            {/* Table Body */}
            {loading ? (
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                color: "#718096",
                fontSize: "1.1rem"
              }}>
                <div style={{ 
                  display: "inline-block", 
                  width: "24px", 
                  height: "24px", 
                  border: "3px solid #e2e8f0",
                  borderTop: "3px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "10px"
                }}></div>
                <div>Loading stock data...</div>
              </div>
            ) : stockItems.length === 0 ? (
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                color: "#718096",
                fontSize: "1.1rem"
              }}>
                <FaCapsules style={{ fontSize: "2rem", marginBottom: "10px", opacity: 0.5 }} />
                <div>No medicines in stock yet.</div>
                <div style={{ fontSize: "0.9rem", marginTop: "5px", opacity: 0.8 }}>
                  Add medicines using the form above to get started.
                </div>
              </div>
            ) : (
              stockItems.map((item, index) => (
                <div key={item.id} style={{ 
                  display: isMobile ? "block" : "grid", 
                  gridTemplateColumns: isMobile ? "none" : "2fr 1fr 1fr 1fr", 
                  padding: isMobile ? "16px" : "16px 20px", 
                  borderTop: index > 0 ? "1px solid #f1f5f9" : "none",
                  backgroundColor: editingItem?.id === item.id ? '#f0fdf4' : (index % 2 === 0 ? '#fafbfc' : 'white'),
                  transition: "all 0.2s ease",
                  alignItems: "center",
                  marginBottom: isMobile ? "8px" : "0"
                }}>
                  {editingItem?.id === item.id ? (
                    <div className="edit-form-container" style={{ gridColumn: '1 / -1', display: 'contents' }}>
                      <div style={{ gridColumn: '1' }}>
                        <input
                          type="text"
                          className="fm-input"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          style={{ 
                            margin: 0, 
                            fontSize: "0.9rem",
                            border: "2px solid #10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: '2' }}>
                        <input
                          type="number"
                          className="fm-input"
                          value={editingItem.quantity}
                          onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value, 10) })}
                          style={{ 
                            margin: 0, 
                            fontSize: "0.9rem",
                            border: "2px solid #10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
                          }}
                          min="1"
                        />
                      </div>
                      <div style={{ gridColumn: '3' }}>
                        <input
                          type="number"
                          className="fm-input"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                          style={{ 
                            margin: 0, 
                            fontSize: "0.9rem",
                            border: "2px solid #10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
                          }}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center', 
                        gridColumn: '4'
                      }}>
                        <button 
                          type="button" 
                          className="fm-search-btn" 
                          onClick={saveEditing}
                          style={{ 
                            padding: "8px 16px",
                            fontSize: "0.8rem",
                            backgroundColor: '#10b981',
                            minHeight: "auto",
                            width: isMobile ? '100%' : 'auto'
                          }}
                        >
                          <FaSave size={14} />
                          Save
                        </button>
                        <button 
                          type="button" 
                          onClick={cancelEditing}
                          style={{ 
                            padding: "8px 16px",
                            fontSize: "0.8rem",
                            backgroundColor: "#f8fafc",
                            color: "#6b7280",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            cursor: "pointer",
                            width: isMobile ? '100%' : 'auto'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isMobile ? (
                        <div>
                          <div style={{ 
                            fontWeight: "600", 
                            color: "#00664c",
                            fontSize: "1rem",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            <FaCapsules style={{ color: "#667eea" }} />
                            {item.name}
                          </div>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            marginBottom: "12px"
                          }}>
                            <div style={{ 
                              color: "#00664c", 
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}>
                              <FaSortNumericUp size={12} />
                              {item.quantity} units
                            </div>
                            <div style={{ 
                              color: "#00664c", 
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}>
                              <FaDollarSign size={12} />
                              ₹{item.price.toFixed(2)}
                            </div>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            justifyContent: 'flex-end' 
                          }}>
                            <button 
                              type="button" 
                              onClick={() => startEditing(item)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                border: "1px solid #bfdbfe",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteItem(item.id)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#fee2e2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <FaTrash size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ 
                            fontWeight: "600", 
                            color: "#00664c",
                            fontSize: "0.95rem",
                            wordBreak: "break-word"
                          }}>
                            {item.name}
                          </div>
                          <div style={{ 
                            color: "#00664c", 
                            fontWeight: "600",
                            fontSize: "0.95rem"
                          }}>
                            {item.quantity} units
                          </div>
                          <div style={{ 
                            color: "#00664c", 
                            fontWeight: "600",
                            fontSize: "0.95rem"
                          }}>
                            ₹{item.price.toFixed(2)}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            justifyContent: 'flex-end' 
                          }}>
                            <button 
                              type="button" 
                              onClick={() => startEditing(item)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#dbeeeaff",
                                color: "#1a9e87",
                                border: "1px solid #a1e7d6ff",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#bfdbfe";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#dbeafe";
                              }}
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteItem(item.id)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#fee2e2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#fecaca";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#fee2e2";
                              }}
                            >
                              <FaTrash size={12} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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