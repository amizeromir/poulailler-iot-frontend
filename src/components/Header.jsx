// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-green-700 text-white shadow-md">
      {/* Titre principal centré */}
      <div className="text-center py-4 border-b border-green-600">
        <h1 className="text-2xl font-bold">🐔 GESTION D'UN POULAILLER INTELLIGENT</h1>
      </div>

      {/* Navigation avec ESPACEMENT MAXIMAL */}
      <nav className="flex justify-center items-center py-4">
        <div className="flex justify-between items-center w-full max-w-2xl px-8">
          <Link 
            to="/dashboard" 
            className="hover:text-green-200 transition font-medium text-lg px-6 py-2"
          >
            Tableau de Bord
          </Link>
          
          {/* L'onglet "Capteurs" a été retiré.
            
          <Link 
            to="/sensors" 
            className="hover:text-green-200 transition font-medium text-lg px-6 py-2"
          >
            Capteurs
          </Link>
          */}
          
          <Link 
            to="/users" 
            className="hover:text-green-200 transition font-medium text-lg px-6 py-2"
          >
            Utilisateurs
          </Link>
        </div>
      </nav>

      {/* Bouton Déconnexion en bas à droite */}
      {user && (
        <div className="border-t border-green-600 py-3 px-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-6 py-2 rounded-lg hover:bg-green-100 transition font-medium"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}