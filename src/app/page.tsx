"use client";

import { useState, useEffect, useCallback } from "react";
import SensorCard from "@/components/SensorCard";
import SensorChart from "@/components/SensorChart";
import {
  generateCurrentSensorData,
  generateSensorHistory,
} from "@/services/sensorData";
import { getAiInsights } from "@/services/aiRecommendation";

function initializeData() {
  const data = generateCurrentSensorData();
  return {
    sensorData: data,
    history: generateSensorHistory(24),
    insight: getAiInsights(data),
    lastUpdated: new Date().toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "medium",
    }),
  };
}

export default function Dashboard() {
  const [state, setState] = useState(initializeData);

  const refreshData = useCallback(() => {
    setState(initializeData());
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const { sensorData, history, insight, lastUpdated } = state;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📊 แดชบอร์ดฟาร์ม
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ข้อมูลเซ็นเซอร์แบบเรียลไทม์
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-xs text-gray-400">
            อัปเดตล่าสุด: {lastUpdated}
          </span>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            🔄 รีเฟรช
          </button>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SensorCard
          title="อุณหภูมิ"
          value={sensorData.temperature}
          unit="°C"
          icon="🌡️"
          color="border-red-500"
          description="อุณหภูมิอากาศ"
          min={15}
          max={45}
        />
        <SensorCard
          title="ความชื้นอากาศ"
          value={sensorData.humidity}
          unit="%"
          icon="💧"
          color="border-blue-500"
          description="ความชื้นสัมพัทธ์"
          min={0}
          max={100}
        />
        <SensorCard
          title="ความชื้นดิน"
          value={sensorData.soilMoisture}
          unit="%"
          icon="🌱"
          color="border-green-500"
          description="ความชื้นในดิน"
          min={0}
          max={100}
        />
        <SensorCard
          title="ค่า pH ดิน"
          value={sensorData.ph}
          unit="pH"
          icon="⚗️"
          color="border-purple-500"
          description="ค่าความเป็นกรด-ด่าง"
          min={4}
          max={9}
        />
        <SensorCard
          title="ความเข้มแสง"
          value={sensorData.light}
          unit="lux"
          icon="☀️"
          color="border-yellow-500"
          description="ปริมาณแสงที่ได้รับ"
          min={0}
          max={1200}
        />
        <SensorCard
          title="ความเร็วลม"
          value={sensorData.windSpeed}
          unit="km/h"
          icon="💨"
          color="border-cyan-500"
          description="ความเร็วลมเฉลี่ย"
          min={0}
          max={30}
        />
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🤖</span> AI วิเคราะห์สรุป
        </h2>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {insight.summary}
        </pre>
      </div>

      {/* Charts Grid */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📈 กราฟข้อมูลย้อนหลัง 24 ชั่วโมง
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <SensorChart
          data={history.temperature || []}
          title="🌡️ อุณหภูมิ"
          color="#ef4444"
          unit="°C"
        />
        <SensorChart
          data={history.humidity || []}
          title="💧 ความชื้นอากาศ"
          color="#3b82f6"
          unit="%"
        />
        <SensorChart
          data={history.soilMoisture || []}
          title="🌱 ความชื้นดิน"
          color="#22c55e"
          unit="%"
        />
        <SensorChart
          data={history.ph || []}
          title="⚗️ ค่า pH ดิน"
          color="#a855f7"
          unit=""
        />
        <SensorChart
          data={history.light || []}
          title="☀️ ความเข้มแสง"
          color="#eab308"
          unit=" lux"
        />
        <SensorChart
          data={history.windSpeed || []}
          title="💨 ความเร็วลม"
          color="#06b6d4"
          unit=" km/h"
        />
      </div>

      {/* Quick Crop Recommendations */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🌱</span> พืชแนะนำ Top 3
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insight.crops.slice(0, 3).map((crop, index) => (
            <div
              key={crop.name}
              className="text-center p-4 rounded-lg bg-green-50 border border-green-100"
            >
              <div className="text-2xl mb-2">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </div>
              <h3 className="font-semibold text-gray-800">{crop.nameTh}</h3>
              <p className="text-sm text-gray-500">{crop.name}</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {crop.score}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ระยะปลูก {crop.growthDays} วัน
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
