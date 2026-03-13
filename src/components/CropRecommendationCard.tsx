import { CropRecommendation } from "@/types";

interface CropRecommendationCardProps {
  crops: CropRecommendation[];
}

export default function CropRecommendationCard({
  crops,
}: CropRecommendationCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreBar = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>🌱</span> พืชแนะนำ
      </h3>
      <div className="space-y-3">
        {crops.slice(0, 5).map((crop, index) => (
          <div
            key={crop.name}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-gray-400 w-6">
              {index + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">
                    {crop.nameTh}
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    ({crop.name})
                  </span>
                </div>
                <span
                  className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(crop.score)}`}
                >
                  {crop.score}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{crop.reason}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                <span>📅 {crop.season}</span>
                <span>⏱ {crop.growthDays} วัน</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${getScoreBar(crop.score)} transition-all duration-500`}
                  style={{ width: `${crop.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
