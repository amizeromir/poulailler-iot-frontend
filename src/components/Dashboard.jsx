import SensorCard from './SensorCard'

export default function Dashboard() {
  const sensors = [
    { name: "Température", value: "27°C" },
    { name: "Humidité", value: "62%" },
    { name: "Niveau d’eau", value: "75%" },
    { name: "État des portes", value: "Fermées" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {sensors.map((s, i) => (
        <SensorCard key={i} name={s.name} value={s.value} />
      ))}
    </div>
  )
}

