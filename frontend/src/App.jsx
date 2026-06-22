import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import FirstPage from "./components/FirstPage.jsx";
import MapPage from "./components/MapPage.jsx";
import PharmacyAdmin from "./components/PharmacyAdmin.jsx";
import PharmacyPage from "./components/PharmacyPage.jsx";
import PharmacyDashboard from "./components/PharmacyDashboard.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import NotFound from "./components/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/mappage" element={<MapPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/pharmacy/admin" element={<PharmacyAdmin />} />
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
