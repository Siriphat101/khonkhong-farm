interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  description?: string;
  min?: number;
  max?: number;
}

export default function SensorCard({
  title,
  value,
  unit,
  icon,
  color,
  description,
  min,
  max,
}: SensorCardProps) {
  const percentage =
    min !== undefined && max !== undefined
      ? ((value - min) / (max - min)) * 100
      : null;

  const getStatusColor = () => {
    if (percentage === null) return "bg-gray-200";
    if (percentage < 25) return "bg-blue-400";
    if (percentage < 50) return "bg-green-400";
    if (percentage < 75) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      {percentage !== null && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${getStatusColor()} transition-all duration-500`}
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          />
        </div>
      )}
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
}
