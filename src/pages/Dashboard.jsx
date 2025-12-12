import { useState, useEffect } from "react";

// NOMS PERSONNALISÉS DES CAPTEURS
const SENSOR_NAMES = {
  1: {
    name: "Poulailler Poussins",
    icon: "🐥",
    description: "Zone d'élevage des poussins (0-4 semaines)",
    color: "from-blue-400 to-cyan-400"
  },
  2: {
    name: "Poulailler Poules de Chair",
    icon: "🍗",
    description: "Zone d'engraissement pour la viande",
    color: "from-green-400 to-emerald-500"
  },
  3: {
    name: "Poulailler Poules Pondeuses",
    icon: "🥚",
    description: "Zone des poules pondeuses pour les œufs",
    color: "from-orange-400 to-red-500"
  }
};

export default function Dashboard() {
  // États pour les capteurs en temps réel
  const [sensors, setSensors] = useState([]);
  // États pour l'historique et filtres
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("24h");
  const [viewMode, setViewMode] = useState("charts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  // 🔁 Fonction de récupération des données temps réel
  const fetchSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Récupération des données...");
      const response = await fetch("https://probable-spoon-69rxqppx499rc4w95-5000.app.github.dev/api/sensors/latest");
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const json = await response.json();
      console.log("📡 Réponse API:", json);
      
      // Gestion des différents formats de réponse
      let sensorData = [];
      
      if (Array.isArray(json)) {
        sensorData = json;
      } else if (json && Array.isArray(json.data)) {
        sensorData = json.data;
      } else if (json && json.capteurs) {
        sensorData = json.capteurs;
      } else if (json && json.sensors) {
        sensorData = json.sensors;
      } else if (json && typeof json === 'object') {
        // Si c'est un seul objet, le mettre dans un tableau
        sensorData = [json];
      } else {
        sensorData = [];
      }
      
      // 🛑 NOUVEAU: Limitation aux 3 premiers capteurs
      const limitedSensors = sensorData.slice(0, 3);
      
      console.log("📊 Données traitées (limitées à 3):", limitedSensors);
      setSensors(limitedSensors);
      setLastUpdate(new Date().toLocaleTimeString());
      
    } catch (err) {
      console.error("❌ Erreur lors de la récupération :", err);
      setError(err.message);
      
      // Données mockées en cas d'erreur (Limitées à 3 capteurs)
      const mockSensors = [
        {
          deviceId: "device1-capteur1",
          temperature: { value: 32.2 },
          humidity: { value: 60 },
          ammonia: { value: 5 },
          luminosity: { value: 300 },
          timestamp: new Date().toISOString()
        },
        {
          deviceId: "device1-capteur2",
          temperature: { value: 25.5 },
          humidity: { value: 55 },
          ammonia: { value: 8 },
          luminosity: { value: 450 },
          timestamp: new Date().toISOString()
        },
        {
          deviceId: "device1-capteur3",
          temperature: { value: 22.4 },
          humidity: { value: 58 },
          ammonia: { value: 12 },
          luminosity: { value: 600 },
          timestamp: new Date().toISOString()
        }
      ];
      
      setSensors(mockSensors);
      setLastUpdate(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
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
    fetchSensors();
    fetchHistory();
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Recharger l'historique quand la période change
  useEffect(() => {
    fetchHistory(timeRange);
  }, [timeRange]);

  // 🔤 Fonctions utilitaires
  const getSensorName = (index) => {
    const sensorNum = index + 1;
    return SENSOR_NAMES[sensorNum]?.name || `Capteur ${sensorNum}`;
  };

  const getSensorIcon = (index) => {
    const sensorNum = index + 1;
    return SENSOR_NAMES[sensorNum]?.icon || "📡";
  };

  const getSensorColorClass = (index) => {
    const sensorNum = index + 1;
    const color = SENSOR_NAMES[sensorNum]?.color || "from-gray-400 to-gray-600";
    return `bg-gradient-to-r ${color}`;
  };

  const getSensorDescription = (index) => {
    const sensorNum = index + 1;
    return SENSOR_NAMES[sensorNum]?.description || "Capteur de température et humidité";
  };

  const getOptimalRange = (index) => {
    const sensorNum = index + 1;
    switch(sensorNum) {
      case 1: return "32-35°C idéal pour poussins";
      case 2: return "20-24°C idéal pour croissance";
      case 3: return "18-22°C idéal pour ponte";
      default: return "20-25°C température normale";
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp > 30) return 'text-red-500';
    if (temp < 20) return 'text-blue-500';
    return 'text-green-500';
  };

  const getHumidityColor = (hum) => {
    if (hum > 80) return 'text-red-500';
    if (hum < 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getAmmoniaColor = (amm) => {
    if (amm > 10) return 'text-red-500';
    return 'text-green-500';
  };

  const safeToFixed = (value, digits) => {
    if (value === undefined || value === null) return '--';
    const num = Number(value);
    if (isNaN(num)) return '--';
    return num.toFixed(digits);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header avec titre et rafraîchissement */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">🥚</span> Ferme Avicole Intelligente
        </h1>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Dernière mise à jour: {lastUpdate}
            </span>
          )}
          <button 
            onClick={fetchSensors}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Rafraîchir
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Mode démo activé: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chargement */}
      {loading && sensors.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Chargement des capteurs...</span>
        </div>
      )}

      {/* Section 1: Cartes des capteurs avec noms personnalisés (LIMITÉE À 3) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">📡 Zones surveillées</h2>
        
        {sensors.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4 text-5xl">📡</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune donnée disponible</h3>
            <p className="text-gray-500 mb-4">Les capteurs ne renvoient pas de données actuellement.</p>
          </div>
        ) : (
          // Affichage des capteurs limités
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensors.map((sensor, index) => (
              <div key={index} className={`rounded-xl shadow-lg overflow-hidden ${getSensorColorClass(index)}`}>
                {/* En-tête colorée avec nom du capteur */}
                <div className="p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{getSensorIcon(index)}</span>
                    <div>
                      <h3 className="font-bold text-xl">{getSensorName(index)}</h3>
                      <p className="text-sm opacity-90">{getSensorDescription(index)}</p>
                    </div>
                  </div>
                  <div className="text-xs opacity-75">{getOptimalRange(index)}</div>
                </div>
                
                {/* Corps blanc avec données */}
                <div className="bg-white p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">🌡️ Température</span>
                      <span className={`font-bold text-lg ${getTemperatureColor(sensor.temperature?.value)}`}>
                        {safeToFixed(sensor.temperature?.value, 1)}°C
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">💧 Humidité</span>
                      <span className={`font-bold text-lg ${getHumidityColor(sensor.humidity?.value)}`}>
                        {safeToFixed(sensor.humidity?.value, 1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">☀️ Luminosité</span>
                      <span className="font-bold text-lg text-purple-600">
                        {safeToFixed(sensor.luminosity?.value, 0)} lux
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">🧪 Ammoniac</span>
                      <span className={`font-bold text-lg ${getAmmoniaColor(sensor.ammonia?.value)}`}>
                        {safeToFixed(sensor.ammonia?.value, 0)} ppm
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Zone {index + 1}</span>
                      <span>⏰ {sensor.timestamp ? new Date(sensor.timestamp).toLocaleTimeString() : 'Maintenant'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Évolution avec graphiques et tableaux (Conservée) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📈 Évolution des Mesures</h2>
          
          {/* Contrôles de période et vue */}
          <div className="flex items-center space-x-4">
            {/* Sélecteur de période */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Dernières 24 heures</option>
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
            </select>

            {/* Sélecteur de vue */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("charts")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "charts" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📊 Graphiques
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "table" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

      {/* Section 3: Résumé des zones */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Résumé des zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🐥</span>
              <div>
                <h3 className="font-bold text-gray-800">Zone 1: Poussins</h3>
                <p className="text-sm text-gray-600">Température idéale: 32-35°C</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Poussins de 0 à 4 semaines, besoin de chaleur constante.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🍗</span>
              <div>
                <h3 className="font-bold text-gray-800">Zone 2: Poules de Chair</h3>
                <p className="text-sm text-gray-600">Température idéale: 20-24°C</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Engraissement optimal pour la production de viande.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🥚</span>
              <div>
                <h3 className="font-bold text-gray-800">Zone 3: Poules Pondeuses</h3>
                <p className="text-sm text-gray-600">Température idéale: 18-22°C</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Production d'œufs optimale avec éclairage contrôlé.</p>
          </div>
        </div>
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

  // Composant Courbe de Tendance
  function LineChart({ data, color, unit, maxValue, timeRange }) {
    const chartHeight = 180;
    const chartWidth = 400;
    const leftMargin = 40;
    const bottomMargin = 30;
    
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
          height={chartHeight + 50}
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

          {/* Grille verticale */}
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
                y={chartHeight - 10}
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

  // Génération de données historiques
  function generateMockHistory(range) {
    const now = new Date();
    const history = [];
    let points, timeStep;

    switch (range) {
      case "24h":
        points = 24;
        timeStep = 3600000;
        break;
      case "7j":
        points = 7;
        timeStep = 86400000;
        break;
      case "30j":
        points = 30;
        timeStep = 86400000;
        break;
      default:
        points = 24;
        timeStep = 3600000;
    }

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * timeStep);
      
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