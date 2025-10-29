export default function SensorCard({ name, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-5 flex flex-col items-center justify-center hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-gray-700">{name}</h2>
      <p className="text-2xl font-bold text-green-600 mt-2">{value}</p>
    </div>
  )
}
