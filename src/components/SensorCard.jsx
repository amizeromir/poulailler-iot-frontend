// src/components/SensorCard.jsx
export default function SensorCard({ title, value, unit, icon, hint }) {
  return (
    <div className="bg-white shadow rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-xl font-semibold">{value} {unit}</div>
          </div>
        </div>
        {hint && <div className="text-xs text-gray-400">{hint}</div>}
      </div>
    </div>
  );
}
