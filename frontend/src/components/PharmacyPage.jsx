import { useEffect, useState } from "react";
import { FaCapsules, FaDollarSign, FaEdit, FaPlus, FaSave, FaSortNumericUp, FaTrash, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import "./PharmacyPage.css";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

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
                <FaCapsules className="fm-icon pharmacy-input-icon" />
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
                <FaSortNumericUp className="fm-icon pharmacy-input-icon" />
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
                <FaDollarSign className="fm-icon pharmacy-input-icon" />
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
                <FaCapsules className="fm-icon pharmacy-input-icon" />
                <input
                  type="text"
                  placeholder="Strength (optional, e.g., 500mg)"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="fm-input with-icon"
                />
              </div>
              <button className="fm-search-btn" type="submit">
                <FaPlus className="pharmacy-add-button-icon" /> Add To Stock
              </button>
            </form>
            {error && <div className="pharmacy-error">{error}</div>}
          </div>
        </div>
        {/* Table below both sections */}
        <div className="pharmacy-table-section">
          <div className="pharmacy-table-shell">
            {/* Table Header */}
            <div className={`pharmacy-table-header ${isMobile ? "pharmacy-table-header-mobile" : ""}`}>
              <div className="pharmacy-table-header-item">
                <FaCapsules className="pharmacy-table-header-icon" />
                Medicine Name
              </div>
              <div className="pharmacy-table-header-item">
                <FaSortNumericUp className="pharmacy-table-header-icon" />
                Quantity
              </div>
              <div className="pharmacy-table-header-item">
                <FaDollarSign className="pharmacy-table-header-icon" />
                Price (₹)
              </div>
              <div className="pharmacy-table-header-actions">Actions</div>
            </div>
            {/* Table Body */}
            {loading ? (
              <div className="pharmacy-table-loading">
                <div className="pharmacy-table-spinner"></div>
                <div>Loading stock data...</div>
              </div>
            ) : stockItems.length === 0 ? (
              <div className="pharmacy-table-empty">
                <FaCapsules className="pharmacy-table-empty-icon" />
                <div>No medicines in stock yet.</div>
                <div className="pharmacy-table-empty-caption">
                  Add medicines using the form above to get started.
                </div>
              </div>
            ) : (
              stockItems.map((item) => (
                <div
                  key={item.id}
                  className={`pharmacy-table-row ${isMobile ? "pharmacy-table-row-mobile" : ""} ${editingItem?.id === item.id ? "pharmacy-table-row-editing" : ""}`}
                >
                  {editingItem?.id === item.id ? (
                    <div className="edit-form-container pharmacy-table-edit-grid">
                      <div className="pharmacy-edit-field pharmacy-edit-field-name">
                        <input
                          type="text"
                          className="fm-input pharmacy-edit-input"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                      </div>
                      <div className="pharmacy-edit-field pharmacy-edit-field-quantity">
                        <input
                          type="number"
                          className="fm-input pharmacy-edit-input"
                          value={editingItem.quantity}
                          onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value, 10) })}
                          min="1"
                        />
                      </div>
                      <div className="pharmacy-edit-field pharmacy-edit-field-price">
                        <input
                          type="number"
                          className="fm-input pharmacy-edit-input"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="pharmacy-table-edit-actions">
                        <button
                          type="button"
                          className="fm-search-btn pharmacy-table-save-button"
                          onClick={saveEditing}
                        >
                          <FaSave size={14} />
                          Save
                        </button>
                        <button
                          type="button"
                          className="pharmacy-table-cancel-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isMobile ? (
                        <div>
                          <div className="pharmacy-table-mobile-title">
                            <FaCapsules className="pharmacy-table-mobile-icon" />
                            {item.name}
                          </div>
                          <div className="pharmacy-table-mobile-summary">
                            <div className="pharmacy-table-mobile-meta">
                              <FaSortNumericUp size={12} />
                              {item.quantity} units
                            </div>
                            <div className="pharmacy-table-mobile-meta">
                              <FaDollarSign size={12} />
                              ₹{item.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="pharmacy-table-actions">
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              className="pharmacy-table-action-button pharmacy-table-action-button-edit"
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              className="pharmacy-table-action-button pharmacy-table-action-button-delete"
                            >
                              <FaTrash size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="pharmacy-table-cell pharmacy-table-cell-name">{item.name}</div>
                          <div className="pharmacy-table-cell">{item.quantity} units</div>
                          <div className="pharmacy-table-cell">₹{item.price.toFixed(2)}</div>
                          <div className="pharmacy-table-actions">
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              className="pharmacy-table-action-button pharmacy-table-action-button-edit"
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              className="pharmacy-table-action-button pharmacy-table-action-button-delete"
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