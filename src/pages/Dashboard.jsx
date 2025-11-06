// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);

  // 🔁 Fonction de récupération des données
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sensors/latest");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  // 🔁 Charger au démarrage + toutes les 5 secondes
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🐔 Poulailler IoT Dashboard</h1>

      {data.length === 0 ? (
        <p>Aucune donnée reçue pour le moment...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((sensor, index) => (
            <div
              key={index}
              className="border rounded-2xl p-4 shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">
                Capteur : {sensor.deviceId || "Inconnu"}
              </h2>

              <p>🌡️ Température : <b>{sensor.temperature} °C</b></p>
              <p>💧 Humidité : <b>{sensor.humidity} %</b></p>
              <p>☀️ Luminosité : <b>{sensor.luminosity}</b></p>
              <p>🧪 Ammoniac : <b>{sensor.ammonia} ppm</b></p>

              <p className="text-sm text-gray-500 mt-2">
                ⏰ {new Date(sensor.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
