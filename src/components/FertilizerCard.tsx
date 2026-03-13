import { FertilizerRecommendation } from "@/types";

interface FertilizerCardProps {
  fertilizers: FertilizerRecommendation[];
}

export default function FertilizerCard({ fertilizers }: FertilizerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>🧪</span> แนะนำปุ๋ยและยา
      </h3>
      <div className="space-y-3">
        {fertilizers.map((fert, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{fert.type === "organic" ? "🌿" : "⚗️"}</span>
                <span className="font-medium text-gray-800">{fert.nameTh}</span>
                <span className="text-sm text-gray-400">({fert.name})</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  fert.type === "organic"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {fert.type === "organic" ? "อินทรีย์" : "เคมี"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{fert.usage}</p>
            <p className="text-xs text-gray-400">
              📅 ความถี่: {fert.frequency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
