// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("24h"); // 24h, 7j, 30j
  const [viewMode, setViewMode] = useState("charts"); // charts, table

  // 🔁 Fonction de récupération des données temps réel
  const fetchData = async () => {
    try {
      const response = await fetch("https://probable-spoon-69rxqppx499rc4w95-5000.app.github.dev/api/sensors/latest");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  // 🔁 Fonction pour l'historique selon la période
  const fetchHistory = async (range = timeRange) => {
    try {
      // Simuler l'appel API avec différentes périodes
      const mockData = generateMockHistory(range);
      setHistory(mockData);
    } catch (error) {
      console.error("Erreur historique :", error);
    }
  };

  // 🔁 Chargement des données
  useEffect(() => {
    fetchData();
    fetchHistory();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Recharger l'historique quand la période change
  useEffect(() => {
    fetchHistory(timeRange);
  }, [timeRange]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📊 Tableau de Bord en Temps Réel</h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((sensor, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              📡 Capteur {sensor.deviceId || "Inconnu"}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🌡️ Température</span>
                <span className={`font-bold ${
                  sensor.temperature?.value > 30 ? 'text-red-500' : 
                  sensor.temperature?.value < 20 ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {sensor.temperature?.value}°C
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">💧 Humidité</span>
                <span className={`font-bold ${
                  sensor.humidity?.value > 80 ? 'text-red-500' : 
                  sensor.humidity?.value < 40 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {sensor.humidity?.value}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">☀️ Luminosité</span>
                <span className="font-bold text-purple-500">
                  {sensor.luminosity?.value} lux
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">🧪 Ammoniac</span>
                <span className={`font-bold ${
                  sensor.ammonia?.value > 10 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {sensor.ammonia?.value} ppm
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-xs text-gray-500">
              ⏰ {new Date(sensor.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Section Évolution avec Contrôles */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📈 Évolution des Mesures</h2>
          
          {/* Contrôles de période et vue */}
          <div className="flex items-center space-x-4">
            {/* Sélecteur de période */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="24h">Dernières 24 heures</option>
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
            </select>

            {/* Sélecteur de vue */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("charts")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "charts" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                📊 Graphiques
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "table" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                📋 Tableau
              </button>
            </div>
          </div>
        </div>

        {/* Affichage conditionnel : Graphiques ou Tableau */}
        {viewMode === "charts" ? (
          <ChartsView history={history} timeRange={timeRange} />
        ) : (
          <TableView history={history} timeRange={timeRange} />
        )}
      </div>
    </div>
  );

  // Composant Vue Graphiques
  function ChartsView({ history, timeRange }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Courbe Température */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-red-500">🌡️ Évolution de la Température</h3>
          <div className="h-64 relative">
            <LineChart 
              data={history.map(h => h.temperature)}
              color="red"
              unit="°C"
              maxValue={35}
              timeRange={timeRange}
            />
          </div>
        </div>

        {/* Courbe Humidité */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-blue-500">💧 Évolution de l'Humidité</h3>
          <div className="h-64 relative">
            <LineChart 
              data={history.map(h => h.humidity)}
              color="blue"
              unit="%"
              maxValue={100}
              timeRange={timeRange}
            />
          </div>
        </div>

        {/* Courbe Ammoniac */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-orange-500">🧪 Évolution de l'Ammoniac</h3>
          <div className="h-64 relative">
            <LineChart 
              data={history.map(h => h.ammonia)}
              color="orange"
              unit="ppm"
              maxValue={20}
              timeRange={timeRange}
            />
          </div>
        </div>

        {/* Courbe Luminosité */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-yellow-500">☀️ Évolution de la Luminosité</h3>
          <div className="h-64 relative">
            <LineChart 
              data={history.map(h => h.luminosity)}
              color="yellow"
              unit="lux"
              maxValue={400}
              timeRange={timeRange}
            />
          </div>
        </div>
      </div>
    );
  }

  // Composant Vue Tableau
  function TableView({ history, timeRange }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                🌡️ Température
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                💧 Humidité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                🧪 Ammoniac
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ☀️ Luminosité
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.timestamp.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${
                    record.temperature > 30 ? 'text-red-500' : 
                    record.temperature < 20 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {record.temperature}°C
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${
                    record.humidity > 80 ? 'text-red-500' : 
                    record.humidity < 40 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {record.humidity}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${
                    record.ammonia > 10 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {record.ammonia} ppm
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-500 font-medium">
                  {record.luminosity} lux
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Composant Courbe de Tendance CORRIGÉ avec marge en bas
  function LineChart({ data, color, unit, maxValue, timeRange }) {
    const chartHeight = 180; // Réduit pour laisser de la place en bas
    const chartWidth = 400;
    const leftMargin = 40; // Marge gauche pour les chiffres
    const bottomMargin = 30; // NOUVELLE MARGE EN BAS pour les heures
    
    if (!data || data.length === 0) return <div className="text-gray-500">Chargement...</div>;

    const points = data.map((value, index) => {
      const x = leftMargin + (index / (data.length - 1)) * (chartWidth - leftMargin);
      const y = (chartHeight - bottomMargin) - (value / maxValue) * (chartHeight - bottomMargin);
      return { x, y, value };
    });

    const pathData = points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ');

    return (
      <div className="relative">
        <svg 
          width="100%" 
          height={chartHeight + 50} // PLUS HAUT pour accommoder les labels du bas
          viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}
        >
          {/* Grille horizontale */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = (chartHeight - bottomMargin) * (1 - ratio);
            const value = Math.round(maxValue * ratio);
            
            return (
              <g key={i}>
                <line 
                  x1={leftMargin}
                  y1={y} 
                  x2={chartWidth} 
                  y2={y} 
                  stroke="#e5e7eb" 
                  strokeWidth="1"
                />
                <text 
                  x={leftMargin - 5}
                  y={y + 4} 
                  className="text-xs fill-gray-500"
                  textAnchor="end"
                >
                  {value}{unit}
                </text>
              </g>
            );
          })}

          {/* Grille verticale - AVEC PLUS D'ESPACE EN BAS */}
          {points.map((point, i) => (
            <g key={i}>
              <line 
                x1={point.x} 
                y1="0" 
                x2={point.x} 
                y2={chartHeight - bottomMargin} 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              <text 
                x={point.x} 
                y={chartHeight - 10} // POSITION CORRIGÉE - plus haut
                className="text-xs fill-gray-500 text-center"
                textAnchor="middle"
              >
                {timeRange === "24h" && i % 3 === 0 ? `${i}h` : ''}
                {timeRange === "7j" && i % 1 === 0 ? `J${i+1}` : ''}
                {timeRange === "30j" && i % 5 === 0 ? `J${i+1}` : ''}
              </text>
            </g>
          ))}

          {/* Courbe */}
          <path 
            d={pathData} 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points sur la courbe */}
          {points.map((point, i) => (
            <circle 
              key={i}
              cx={point.x} 
              cy={point.y} 
              r="3" 
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Zone remplie sous la courbe */}
          <path 
            d={`${pathData} L ${chartWidth},${chartHeight - bottomMargin} L ${leftMargin},${chartHeight - bottomMargin} Z`} 
            fill={color} 
            fillOpacity="0.1" 
          />

          {/* Ligne verticale à gauche */}
          <line 
            x1={leftMargin} 
            y1="0" 
            x2={leftMargin} 
            y2={chartHeight - bottomMargin} 
            stroke="#374151" 
            strokeWidth="2"
          />

          {/* Ligne horizontale en bas */}
          <line 
            x1={leftMargin} 
            y1={chartHeight - bottomMargin} 
            x2={chartWidth} 
            y2={chartHeight - bottomMargin} 
            stroke="#374151" 
            strokeWidth="2"
          />
        </svg>

        {/* Légende valeur actuelle */}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-sm">
          <span style={{ color }} className="font-bold">
            {data[data.length - 1]}{unit}
          </span>
        </div>
      </div>
    );
  }

  // Génération de données historiques selon la période
  function generateMockHistory(range) {
    const now = new Date();
    const history = [];
    let points, timeStep;

    switch (range) {
      case "24h":
        points = 24;
        timeStep = 3600000; // 1 heure
        break;
      case "7j":
        points = 7;
        timeStep = 86400000; // 1 jour
        break;
      case "30j":
        points = 30;
        timeStep = 86400000; // 1 jour
        break;
      default:
        points = 24;
        timeStep = 3600000;
    }

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * timeStep);
      
      // Variations selon la période
      const hour = time.getHours();
      const baseTemp = 22 + Math.sin((hour - 6) * Math.PI / 12) * 8;
      const baseHumidity = 60 - Math.sin((hour - 6) * Math.PI / 12) * 20;
      const baseLuminosity = hour > 6 && hour < 20 ? 100 + Math.random() * 250 : 10 + Math.random() * 30;
      const baseAmmonia = 5 + Math.random() * 8;
      
      history.push({
        temperature: Math.round((baseTemp + (Math.random() - 0.5) * 3) * 10) / 10,
        humidity: Math.round((baseHumidity + (Math.random() - 0.5) * 10) * 10) / 10,
        ammonia: Math.round((baseAmmonia + (Math.random() - 0.5) * 2) * 10) / 10,
        luminosity: Math.round(baseLuminosity + (Math.random() - 0.5) * 50),
        timestamp: time
      });
    }
    
    return history;
  }
}