// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// wrapper pour récupérer les dernières valeurs (endpoint backend attendu: /sensors/latest)
export async function fetchLatest() {
  try {
    const res = await API.get("/sensors/latest");
    return res.data;
  } catch (e) {
    // fallback mock data when backend not available
    return {
      temperature: 26.4,
      humidity: 63.2,
      waterLevel: 78,
      eggsStock: 124,
      luminosity: 540,
      timestamp: new Date().toISOString()
    };
  }
}

// wrapper pour récupérer historique (endpoint backend: /sensors/history?type=temperature&limit=50)
export async function fetchHistory(type = "temperature", limit = 30) {
  try {
    const res = await API.get(`/sensors/history?type=${type}&limit=${limit}`);
    return res.data; // expected array of numbers or objects
  } catch (e) {
    // mock array
    return new Array(limit).fill(0).map((_, i) => {
      // small random walk around 25-30 for temperature, etc
      if (type === "temperature") return 23 + Math.sin(i / 3) * 3 + Math.random();
      if (type === "humidity") return 60 + Math.cos(i / 5) * 6 + Math.random();
      if (type === "waterLevel") return 70 + Math.random() * 10;
      if (type === "eggsStock") return 100 + (i % 5);
      if (type === "luminosity") return 300 + Math.random() * 400;
      return Math.random() * 10;
    });
  }
}

export default API;
