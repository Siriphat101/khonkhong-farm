"use client";

import { useState } from "react";
import CropRecommendationCard from "@/components/CropRecommendationCard";
import DiseaseAlertCard from "@/components/DiseaseAlertCard";
import FertilizerCard from "@/components/FertilizerCard";
import { generateCurrentSensorData } from "@/services/sensorData";
import { getAiInsights } from "@/services/aiRecommendation";

function initializeData() {
  const data = generateCurrentSensorData();
  return {
    sensorData: data,
    insight: getAiInsights(data),
  };
}

export default function AssistantPage() {
  const [state, setState] = useState(initializeData);
  const [activeTab, setActiveTab] = useState<
    "crops" | "diseases" | "fertilizers"
  >("crops");

  const refreshData = () => {
    setState(initializeData());
  };

  const { sensorData, insight } = state;

  const tabs = [
    { key: "crops" as const, label: "🌱 แนะนำพืช", count: insight.crops.length },
    {
      key: "diseases" as const,
      label: "🔬 ตรวจโรค",
      count: insight.diseases.length,
    },
    {
      key: "fertilizers" as const,
      label: "🧪 ปุ๋ยและยา",
      count: insight.fertilizers.length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🤖 AI ผู้ช่วยฟาร์ม
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            วิเคราะห์และแนะนำจากข้อมูลเซ็นเซอร์อัตโนมัติ
          </p>
        </div>
        <button
          onClick={refreshData}
          className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          🔄 วิเคราะห์ใหม่
        </button>
      </div>

      {/* Current Sensor Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">
          📡 ข้อมูลเซ็นเซอร์ปัจจุบัน
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {sensorData.temperature}°C
            </p>
            <p className="text-xs text-gray-500">🌡️ อุณหภูมิ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {sensorData.humidity}%
            </p>
            <p className="text-xs text-gray-500">💧 ความชื้นอากาศ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {sensorData.soilMoisture}%
            </p>
            <p className="text-xs text-gray-500">🌱 ความชื้นดิน</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {sensorData.ph}
            </p>
            <p className="text-xs text-gray-500">⚗️ pH ดิน</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {sensorData.light}
            </p>
            <p className="text-xs text-gray-500">☀️ แสง (lux)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600">
              {sensorData.windSpeed}
            </p>
            <p className="text-xs text-gray-500">💨 ลม (km/h)</p>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📋</span> สรุปผลวิเคราะห์
        </h2>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
          {insight.summary}
        </pre>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "crops" && (
          <CropRecommendationCard crops={insight.crops} />
        )}
        {activeTab === "diseases" && (
          <DiseaseAlertCard diseases={insight.diseases} />
        )}
        {activeTab === "fertilizers" && (
          <FertilizerCard fertilizers={insight.fertilizers} />
        )}
      </div>
    </div>
  );
}
