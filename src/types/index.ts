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

// Dataset Labeling Types
export interface BoundingBox {
  classId: number;
  className: string;
  xCenter: number;
  yCenter: number;
  width: number;
  height: number;
  confidence: number;
}

export interface LabeledImage {
  id: string;
  fileName: string;
  dataUrl: string;
  imageWidth: number;
  imageHeight: number;
  boxes: BoundingBox[];
  status: "pending" | "labeling" | "done" | "error";
  error?: string;
}

export interface LabelClass {
  id: number;
  name: string;
}

export interface LabelingConfig {
  apiKey: string;
  model: string;
  classes: LabelClass[];
  prompt: string;
}
