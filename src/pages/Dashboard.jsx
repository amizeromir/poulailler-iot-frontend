// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import SensorCard from "../components/SensorCard";
import LineChart from "../components/LineChart";
import { fetchLatest, fetchHistory } from "../services/api";

export default function Dashboard() {
  const [latest, setLatest] = useState(null);
  const [tempHistory, setTempHistory] = useState([]);
  const [humHistory, setHumHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const l = await fetchLatest();
    const tHist = await fetchHistory("temperature", 30);
    const hHist = await fetchHistory("humidity", 30);
    setLatest(l);
    setTempHistory(tHist);
    setHumHistory(hHist);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    const iv = setInterval(loadData, 10000); // refresh every 10s
    return () => clearInterval(iv);
  }, []);

  if (loading || !latest) {
    return <div className="text-center mt-10 text-gray-500">Chargement du dashboard…</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SensorCard title="Température" value={latest.temperature} unit="°C" icon="🌡️" hint={new Date(latest.timestamp).toLocaleTimeString()} />
        <SensorCard title="Humidité" value={latest.humidity} unit="%" icon="💧" hint={`Dernière: ${new Date(latest.timestamp).toLocaleString()}`} />
        <SensorCard title="Niveau d'eau" value={latest.waterLevel ?? "—"} unit="%" icon="🚰" />
        <SensorCard title="Stock d'œufs" value={latest.eggsStock ?? "—"} unit="pcs" icon="🥚" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Historique Température</h3>
          <LineChart data={tempHistory} label="Temp (°C)" color="rgba(255,99,132,1)" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Historique Humidité</h3>
          <LineChart data={humHistory} label="Hum (%)" color="rgba(54,162,235,1)" />
        </div>
      </div>
    </div>
  );
}
