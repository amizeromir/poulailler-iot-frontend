// src/components/LineChart.jsx
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function LineChart({ data = [], label = "", color = "rgba(34,197,94,1)" }) {
  const chartData = {
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace(/1\)$/, "0.15)") || "rgba(34,197,94,0.15)",
        tension: 0.25,
        fill: true,
        pointRadius: 0
      }
    ]
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { beginAtZero: false } }
  };

  return <Line data={chartData} options={options} />;
}
