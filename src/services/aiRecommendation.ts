import {
  SensorData,
  CropRecommendation,
  DiseaseAlert,
  FertilizerRecommendation,
  AiInsight,
} from "@/types";

const CROP_DATABASE: Omit<CropRecommendation, "score">[] = [
  {
    name: "Rice",
    nameTh: "ข้าว",
    reason: "เหมาะกับสภาพอากาศร้อนชื้น ดินมีความชื้นสูง",
    season: "ฤดูฝน (มิ.ย. - พ.ย.)",
    growthDays: 120,
  },
  {
    name: "Corn",
    nameTh: "ข้าวโพด",
    reason: "เติบโตได้ดีในอุณหภูมิปานกลาง ดินระบายน้ำดี",
    season: "ตลอดปี",
    growthDays: 90,
  },
  {
    name: "Cassava",
    nameTh: "มันสำปะหลัง",
    reason: "ทนแล้งได้ดี เหมาะกับดินร่วนปนทราย",
    season: "ต้นฤดูฝน (เม.ย. - มิ.ย.)",
    growthDays: 270,
  },
  {
    name: "Chili",
    nameTh: "พริก",
    reason: "เหมาะกับอากาศอบอุ่น ดินมี pH เป็นกลาง",
    season: "ตลอดปี",
    growthDays: 75,
  },
  {
    name: "Lettuce",
    nameTh: "ผักกาดหอม",
    reason: "เหมาะกับอากาศเย็น ความชื้นสูง",
    season: "ฤดูหนาว (พ.ย. - ก.พ.)",
    growthDays: 45,
  },
  {
    name: "Tomato",
    nameTh: "มะเขือเทศ",
    reason: "เหมาะกับอุณหภูมิปานกลาง แสงแดดจัด",
    season: "ฤดูหนาว (ต.ค. - ก.พ.)",
    growthDays: 60,
  },
  {
    name: "Sugarcane",
    nameTh: "อ้อย",
    reason: "ต้องการน้ำมาก อุณหภูมิสูง",
    season: "ต้นฤดูฝน",
    growthDays: 365,
  },
  {
    name: "Morning Glory",
    nameTh: "ผักบุ้ง",
    reason: "เติบโตเร็ว ชอบน้ำมาก",
    season: "ตลอดปี",
    growthDays: 25,
  },
];

function calculateCropScore(
  crop: Omit<CropRecommendation, "score">,
  data: SensorData
): number {
  let score = 50;

  switch (crop.name) {
    case "Rice":
      if (data.temperature >= 25 && data.temperature <= 35) score += 20;
      if (data.humidity >= 60) score += 15;
      if (data.soilMoisture >= 60) score += 15;
      if (data.ph >= 5.5 && data.ph <= 7.0) score += 10;
      break;
    case "Corn":
      if (data.temperature >= 20 && data.temperature <= 30) score += 20;
      if (data.humidity >= 40 && data.humidity <= 70) score += 15;
      if (data.soilMoisture >= 30 && data.soilMoisture <= 60) score += 15;
      if (data.ph >= 5.8 && data.ph <= 7.0) score += 10;
      break;
    case "Cassava":
      if (data.temperature >= 25 && data.temperature <= 35) score += 20;
      if (data.soilMoisture <= 50) score += 15;
      if (data.ph >= 5.5 && data.ph <= 7.0) score += 10;
      if (data.humidity <= 70) score += 10;
      break;
    case "Chili":
      if (data.temperature >= 20 && data.temperature <= 30) score += 20;
      if (data.humidity >= 50 && data.humidity <= 70) score += 15;
      if (data.ph >= 6.0 && data.ph <= 7.0) score += 15;
      if (data.light >= 500) score += 10;
      break;
    case "Lettuce":
      if (data.temperature >= 15 && data.temperature <= 25) score += 25;
      if (data.humidity >= 60 && data.humidity <= 80) score += 15;
      if (data.soilMoisture >= 50) score += 10;
      if (data.ph >= 6.0 && data.ph <= 7.0) score += 10;
      break;
    case "Tomato":
      if (data.temperature >= 20 && data.temperature <= 30) score += 20;
      if (data.light >= 600) score += 15;
      if (data.ph >= 6.0 && data.ph <= 7.0) score += 10;
      if (data.humidity >= 40 && data.humidity <= 70) score += 10;
      break;
    case "Sugarcane":
      if (data.temperature >= 28 && data.temperature <= 38) score += 20;
      if (data.soilMoisture >= 50) score += 15;
      if (data.humidity >= 60) score += 10;
      if (data.ph >= 5.5 && data.ph <= 7.5) score += 10;
      break;
    case "Morning Glory":
      if (data.temperature >= 25 && data.temperature <= 35) score += 15;
      if (data.soilMoisture >= 60) score += 20;
      if (data.humidity >= 60) score += 10;
      if (data.ph >= 5.5 && data.ph <= 7.0) score += 10;
      break;
  }

  return Math.min(score, 100);
}

function detectDiseases(data: SensorData): DiseaseAlert[] {
  const diseases: DiseaseAlert[] = [];

  if (data.humidity > 80 && data.temperature > 25) {
    diseases.push({
      name: "Fungal Infection",
      nameTh: "โรคเชื้อรา",
      risk: "high",
      description:
        "ความชื้นสูงและอุณหภูมิอุ่นเป็นสภาพที่เหมาะสมกับการเจริญเติบโตของเชื้อรา",
      prevention:
        "ลดความชื้นโดยการระบายอากาศ ใช้สารป้องกันเชื้อรา เช่น แมนโคเซบ หรือคาร์เบนดาซิม",
    });
  }

  if (data.humidity > 70 && data.temperature > 28) {
    diseases.push({
      name: "Bacterial Wilt",
      nameTh: "โรคเหี่ยวจากแบคทีเรีย",
      risk: data.humidity > 85 ? "high" : "medium",
      description:
        "แบคทีเรียในดินที่ทำให้พืชเหี่ยวและตาย พบมากในสภาพอากาศร้อนชื้น",
      prevention:
        "หมุนเวียนพืช หลีกเลี่ยงการรดน้ำมากเกินไป ใช้พืชพันธุ์ต้านทาน",
    });
  }

  if (data.temperature > 35 && data.light > 800) {
    diseases.push({
      name: "Sunscald",
      nameTh: "โรคใบไหม้จากแดด",
      risk: "medium",
      description:
        "แสงแดดจัดและอุณหภูมิสูงทำให้ใบพืชไหม้ เซลล์พืชเสียหาย",
      prevention:
        "ใช้ตาข่ายพรางแสง ให้น้ำสม่ำเสมอ ปลูกพืชคลุมดิน",
    });
  }

  if (data.soilMoisture > 80) {
    diseases.push({
      name: "Root Rot",
      nameTh: "โรครากเน่า",
      risk: "high",
      description:
        "ดินที่ชื้นเกินไปทำให้รากพืชขาดอากาศและเน่าเสีย",
      prevention:
        "ปรับปรุงระบบระบายน้ำ ลดปริมาณการรดน้ำ ใช้ไตรโคเดอร์มา",
    });
  }

  if (data.humidity < 30 && data.temperature > 30) {
    diseases.push({
      name: "Spider Mites",
      nameTh: "ไรแดง",
      risk: "medium",
      description:
        "สภาพอากาศร้อนและแห้งเหมาะกับการระบาดของไรแดง",
      prevention:
        "พ่นน้ำบนใบพืชเพื่อเพิ่มความชื้น ใช้สารกำจัดไร หรือปล่อยแมลงศัตรูธรรมชาติ",
    });
  }

  if (diseases.length === 0) {
    diseases.push({
      name: "No significant risk",
      nameTh: "ไม่พบความเสี่ยงที่สำคัญ",
      risk: "low",
      description: "สภาพแวดล้อมปัจจุบันอยู่ในเกณฑ์ปกติ ไม่พบปัจจัยเสี่ยงของโรค",
      prevention: "ตรวจสอบแปลงเป็นประจำ รักษาความสะอาด และหมุนเวียนพืช",
    });
  }

  return diseases;
}

function recommendFertilizers(data: SensorData): FertilizerRecommendation[] {
  const fertilizers: FertilizerRecommendation[] = [];

  if (data.ph < 6.0) {
    fertilizers.push({
      name: "Dolomite Lime",
      nameTh: "โดโลไมท์",
      type: "chemical",
      usage: "ใส่โดโลไมท์ 100-200 กก./ไร่ เพื่อเพิ่มค่า pH ของดิน",
      frequency: "ทุก 3-6 เดือน",
    });
  }

  if (data.ph > 7.5) {
    fertilizers.push({
      name: "Sulfur",
      nameTh: "กำมะถัน",
      type: "chemical",
      usage: "ใส่กำมะถัน 20-40 กก./ไร่ เพื่อลดค่า pH ของดิน",
      frequency: "ทุก 3-6 เดือน",
    });
  }

  if (data.soilMoisture < 30) {
    fertilizers.push({
      name: "Compost",
      nameTh: "ปุ๋ยหมัก",
      type: "organic",
      usage:
        "ใส่ปุ๋ยหมัก 500-1000 กก./ไร่ เพื่อเพิ่มความสามารถในการอุ้มน้ำของดิน",
      frequency: "ทุก 1-2 เดือน",
    });
  }

  fertilizers.push({
    name: "NPK 15-15-15",
    nameTh: "ปุ๋ยสูตร 15-15-15",
    type: "chemical",
    usage: "ใส่ปุ๋ย 25-50 กก./ไร่ เป็นปุ๋ยรองพื้นก่อนปลูก",
    frequency: "ก่อนปลูกและทุก 1-2 เดือน",
  });

  fertilizers.push({
    name: "Organic Fertilizer",
    nameTh: "ปุ๋ยอินทรีย์",
    type: "organic",
    usage:
      "ใส่ปุ๋ยอินทรีย์ 200-500 กก./ไร่ เพื่อปรับปรุงโครงสร้างดินและเพิ่มจุลินทรีย์",
    frequency: "ทุก 1-3 เดือน",
  });

  return fertilizers;
}

export function getAiInsights(data: SensorData): AiInsight {
  const crops = CROP_DATABASE.map((crop) => ({
    ...crop,
    score: calculateCropScore(crop, data),
  })).sort((a, b) => b.score - a.score);

  const diseases = detectDiseases(data);
  const fertilizers = recommendFertilizers(data);

  const topCrop = crops[0];
  const highRiskDiseases = diseases.filter((d) => d.risk === "high");

  let summary = `📊 วิเคราะห์จากข้อมูลเซ็นเซอร์: อุณหภูมิ ${data.temperature}°C, ความชื้น ${data.humidity}%, ความชื้นดิน ${data.soilMoisture}%, pH ${data.ph}\n\n`;

  summary += `🌱 พืชแนะนำอันดับ 1: ${topCrop.nameTh} (${topCrop.name}) - คะแนนความเหมาะสม ${topCrop.score}%\n`;

  if (highRiskDiseases.length > 0) {
    summary += `\n⚠️ พบความเสี่ยงโรค ${highRiskDiseases.length} รายการ: ${highRiskDiseases.map((d) => d.nameTh).join(", ")}\n`;
  } else {
    summary += `\n✅ ไม่พบความเสี่ยงโรคที่สำคัญ\n`;
  }

  summary += `\n💡 คำแนะนำ: ${fertilizers[0].usage}`;

  return { crops, diseases, fertilizers, summary };
}
