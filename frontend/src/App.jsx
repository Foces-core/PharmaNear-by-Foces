import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Synchronous imports for lightweight landing pages
import FirstPage from './components/FirstPage.jsx';
import PharmacyPage from './components/PharmacyPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import AboutUs from './components/AboutUs.jsx';
import Services from './components/Services.jsx';
import Contact from './components/Contact.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsOfService from './components/TermsOfService.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

// LAZY LOADED IMPORTS (Splits heavy dependencies like Leaflet into separate chunks)
const MapPage = React.lazy(() => import('./components/MapPage.jsx'));
const PharmacyAdmin = React.lazy(() => import('./components/PharmacyAdmin.jsx'));
const PharmacyDashboard = React.lazy(() => import('./components/PharmacyDashboard.jsx'));

// A clean loading fallback component
const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    Loading...
  </div>
);
function App() {
  return (
    <BrowserRouter>
      {/* Suspense boundary catches lazy loaded paths and shows a fallback while downloading the bundle */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/mappage" element={<MapPage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
          <Route path="/pharmacy/admin" element={<PharmacyAdmin />} />
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;