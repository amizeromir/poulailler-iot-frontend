// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sensors from "./pages/Sensors";
import Users from "./pages/Users";
import Header from "./components/Header";
import Login from "./pages/Login"; // ton fichier login.jsx

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Page de login par défaut */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* Routes protégées (affichées après login) */}
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <div className="max-w-6xl mx-auto p-6">
                  <Dashboard />
                </div>
              </>
            }
          />

          <Route
            path="/sensors"
            element={
              <>
                <Header />
                <div className="max-w-6xl mx-auto p-6">
                  <Sensors />
                </div>
              </>
            }
          />

          <Route
            path="/users"
            element={
              <>
                <Header />
                <div className="max-w-6xl mx-auto p-6">
                  <Users />
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
