import { SensorHistory } from "@/types";

interface SensorChartProps {
  data: SensorHistory[];
  title: string;
  color: string;
  unit: string;
}

export default function SensorChart({
  data,
  title,
  color,
  unit,
}: SensorChartProps) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const chartHeight = 120;

  const pointCount = data.length > 1 ? data.length - 1 : 1;
  const points = data
    .map((d, i) => {
      const x = (i / pointCount) * 100;
      const y = chartHeight - ((d.value - minVal) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const avgValue = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(
    1
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            ต่ำสุด: {minVal.toFixed(1)}
            {unit}
          </span>
          <span>
            เฉลี่ย: {avgValue}
            {unit}
          </span>
          <span>
            สูงสุด: {maxVal.toFixed(1)}
            {unit}
          </span>
        </div>
      </div>
      <svg
        viewBox={`-5 -5 110 ${chartHeight + 10}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          fill={`${color}20`}
          stroke="none"
          points={`0,${chartHeight} ${points} 100,${chartHeight}`}
        />
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
