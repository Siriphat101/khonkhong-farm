import { DiseaseAlert } from "@/types";

interface DiseaseAlertCardProps {
  diseases: DiseaseAlert[];
}

export default function DiseaseAlertCard({ diseases }: DiseaseAlertCardProps) {
  const getRiskBadge = (risk: DiseaseAlert["risk"]) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getRiskLabel = (risk: DiseaseAlert["risk"]) => {
    switch (risk) {
      case "high":
        return "เสี่ยงสูง";
      case "medium":
        return "เสี่ยงปานกลาง";
      case "low":
        return "เสี่ยงต่ำ";
    }
  };

  const getRiskIcon = (risk: DiseaseAlert["risk"]) => {
    switch (risk) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>🔬</span> การตรวจโรคและแมลง
      </h3>
      <div className="space-y-3">
        {diseases.map((disease, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{getRiskIcon(disease.risk)}</span>
                <span className="font-medium text-gray-800">
                  {disease.nameTh}
                </span>
                <span className="text-sm text-gray-400">({disease.name})</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full border ${getRiskBadge(disease.risk)}`}
              >
                {getRiskLabel(disease.risk)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{disease.description}</p>
            <div className="flex items-start gap-2 bg-blue-50 p-2 rounded text-sm">
              <span>💊</span>
              <p className="text-blue-800">{disease.prevention}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
