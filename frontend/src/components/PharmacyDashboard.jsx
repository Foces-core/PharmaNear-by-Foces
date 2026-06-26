import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./PharmacyDashboard.css";

const initialMedicines = [
  { id: 1, name: "Paracetamol 500mg", batchNo: "A123", expiryDate: "2025-12-31", quantity: 150, price: 5.5, supplier: "Pharma Inc." },
  { id: 2, name: "Amoxicillin 250mg", batchNo: "B456", expiryDate: "2024-11-30", quantity: 80, price: 12.75, supplier: "MediSupplies" },
  { id: 3, name: "Ibuprofen 200mg", batchNo: "C789", expiryDate: "2026-05-20", quantity: 200, price: 8.0, supplier: "Pharma Inc." },
  { id: 4, name: "Cetirizine 10mg", batchNo: "D101", expiryDate: "2025-08-15", quantity: 45, price: 7.2, supplier: "HealthGoods" },
  { id: 5, name: "Loratadine 10mg", batchNo: "E112", expiryDate: "2024-09-01", quantity: 15, price: 9.5, supplier: "MediSupplies" },
  { id: 6, name: "Aspirin 81mg", batchNo: "F131", expiryDate: "2027-01-30", quantity: 300, price: 4.0, supplier: "Pharma Inc." },
];

const LOW_STOCK_THRESHOLD = 50;
const EXPIRY_THRESHOLD_DAYS = 90;

const isNearingExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= EXPIRY_THRESHOLD_DAYS;
};

// SVG Icons 
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

// Header component 
const Header = () => (
  <header className="header">
    <h1 className="logo">PharmaNear</h1>
    <button className="logout">Logout</button>
  </header>
);

// StatCard component
const StatCard = ({ title, value, description }) => (
  <div className="stat-card">
    <p className="stat-title">{title}</p>
    <p className="stat-value">{value}</p>
    <p className="stat-desc">{description}</p>
  </div>
);

// Modal component 
const MedicineModal = ({ isOpen, onClose, onSave, medicine }) => {
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setFormData(medicine || { name: "", batchNo: "", expiryDate: "", quantity: "", price: "", supplier: "" });
  }, [medicine, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, quantity: parseInt(formData.quantity, 10), price: parseFloat(formData.price) });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{medicine ? "Edit Medicine" : "Add New Medicine"}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Medicine Name" required />
          <input type="text" name="batchNo" value={formData.batchNo} onChange={handleChange} placeholder="Batch No." required />
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Supplier" required />
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required min="0" />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required step="0.01" min="0" />
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn save">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const lowStockCount = useMemo(() => medicines.filter(m => m.quantity < LOW_STOCK_THRESHOLD).length, [medicines]);
  const expiringSoonCount = useMemo(() => medicines.filter(m => isNearingExpiry(m.expiryDate)).length, [medicines]);

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (medicineData) => {
    if (medicineData.id) {
      setMedicines(medicines.map(m => (m.id === medicineData.id ? medicineData : m)));
    } else {
      const newId = medicines.length ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
      setMedicines([...medicines, { ...medicineData, id: newId }]);
    }
  };

  return (
    <div className="app">
      <Header />
      
      {/* Container wraps the rest of the content */}
      <main className="container">
        
        {/* Stats Grid - Now uses flex to be side-by-side */}
        <div className="stats-grid">
          <StatCard title="Total Medicines" value={medicines.length} description="Distinct products in inventory" />
          <StatCard title="Low Stock Items" value={lowStockCount} description={`Below ${LOW_STOCK_THRESHOLD} units`} />
          <StatCard title="Expiring Soon" value={expiringSoonCount} description={`Within ${EXPIRY_THRESHOLD_DAYS} days`} />
        </div>

        {/* Search and Add Button - Combined into a table-actions div */}
        <div className="table-actions">
          <div className="search-box">
            <SearchIcon />
            {/* The placeholder is "Search..." in the image */}
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn add" onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }}>
            <PlusIcon /> Add Medicine
          </button>
        </div>

        {/* The Table itself */}
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch No.</th>
              <th>Expiry Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => (
              <tr key={med.id}>
                <td>{med.name}</td>
                <td>{med.batchNo}</td>
                <td className={isNearingExpiry(med.expiryDate) ? "expiring" : ""}>{med.expiryDate}</td>
                <td className={med.quantity < LOW_STOCK_THRESHOLD ? "low-stock" : ""}>{med.quantity}</td>
                <td>${med.price.toFixed(2)}</td>
                <td>
                  <button className="icon-btn edit" onClick={() => { setEditingMedicine(med); setIsModalOpen(true); }}><EditIcon /></button>
                  <button className="icon-btn delete" onClick={() => setMedicines(medicines.filter(m => m.id !== med.id))}><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMedicines.length === 0 && <div className="empty">No medicines found.</div>}
      </main>

      <MedicineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} medicine={editingMedicine} />
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