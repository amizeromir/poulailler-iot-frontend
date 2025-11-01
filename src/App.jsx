// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sensors from "./pages/Sensors"; // on créera la page ensuite
import Users from "./pages/Users";     // idem
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <nav className="mb-6 flex gap-4">
            <Link to="/" className="text-blue-600 font-medium">Dashboard</Link>
            <Link to="/sensors" className="text-gray-600">Capteurs</Link>
            <Link to="/users" className="text-gray-600">Utilisateurs</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
