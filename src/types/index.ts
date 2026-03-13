export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  light: number;
  windSpeed: number;
  timestamp: string;
}

export interface SensorHistory {
  label: string;
  value: number;
}

export interface CropRecommendation {
  name: string;
  nameTh: string;
  score: number;
  reason: string;
  season: string;
  growthDays: number;
}

export interface DiseaseAlert {
  name: string;
  nameTh: string;
  risk: "low" | "medium" | "high";
  description: string;
  prevention: string;
}

export interface FertilizerRecommendation {
  name: string;
  nameTh: string;
  type: "organic" | "chemical";
  usage: string;
  frequency: string;
}

export interface AiInsight {
  crops: CropRecommendation[];
  diseases: DiseaseAlert[];
  fertilizers: FertilizerRecommendation[];
  summary: string;
}

export interface MenuItem {
  id: string;
  href: string;
  label: string;
  icon: string;
  isDefault?: boolean;
}
