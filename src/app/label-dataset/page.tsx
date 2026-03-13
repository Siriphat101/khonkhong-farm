"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { LabeledImage, LabelClass } from "@/types";
import {
  buildLabelingPrompt,
  parseLLMResponse,
  toYOLOFormat,
  generateClassesTxt,
  downloadFile,
} from "@/services/labelDataset";

const DEFAULT_CLASSES: LabelClass[] = [
  { id: 0, name: "rice" },
  { id: 1, name: "corn" },
  { id: 2, name: "disease_spot" },
  { id: 3, name: "pest" },
  { id: 4, name: "weed" },
];

const SUPPORTED_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
];

// Color palette for bounding boxes
const BOX_COLORS = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF",
  "#00FFFF", "#FF8000", "#8000FF", "#0080FF", "#FF0080",
];

function getBoxColor(classId: number): string {
  return BOX_COLORS[classId % BOX_COLORS.length];
}

export default function LabelDatasetPage() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [classes, setClasses] = useState<LabelClass[]>(DEFAULT_CLASSES);
  const [newClassName, setNewClassName] = useState("");
  const [images, setImages] = useState<LabeledImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLabeling, setIsLabeling] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<LabeledImage[]>(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const selectedImage = images.find((img) => img.id === selectedImageId);

  // Add a new class
  const addClass = useCallback(() => {
    const name = newClassName.trim();
    if (!name) return;
    if (classes.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    const nextId = classes.length > 0 ? Math.max(...classes.map((c) => c.id)) + 1 : 0;
    setClasses((prev) => [...prev, { id: nextId, name }]);
    setNewClassName("");
  }, [newClassName, classes]);

  // Remove a class
  const removeClass = useCallback((id: number) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Handle image upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const img = new Image();
          img.onload = () => {
            const newImage: LabeledImage = {
              id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              fileName: file.name,
              dataUrl,
              imageWidth: img.width,
              imageHeight: img.height,
              boxes: [],
              status: "pending",
            };
            setImages((prev) => [...prev, newImage]);
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      });

      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  // Label a single image using LLM
  const labelImage = useCallback(
    async (imageId: string) => {
      if (!apiKey) {
        alert("กรุณาใส่ API Key ก่อนเริ่มการ Label");
        return;
      }
      if (classes.length === 0) {
        alert("กรุณาเพิ่ม Class อย่างน้อย 1 รายการ");
        return;
      }

      const image = imagesRef.current.find((img) => img.id === imageId);
      if (!image) return;

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, status: "labeling", error: undefined } : img
        )
      );

      try {
        const prompt = buildLabelingPrompt(classes, customPrompt);
        const response = await fetch("/api/label", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: image.dataUrl,
            prompt,
            apiKey,
            model,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "API request failed");
        }

        const boxes = parseLLMResponse(data.result, classes);

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, boxes, status: "done" } : img
          )
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, status: "error", error: message }
              : img
          )
        );
      }
    },
    [apiKey, classes, customPrompt, model]
  );

  // Label all pending images
  const labelAllImages = useCallback(async () => {
    if (!apiKey) {
      alert("กรุณาใส่ API Key ก่อนเริ่มการ Label");
      return;
    }
    setIsLabeling(true);
    const pending = images.filter(
      (img) => img.status === "pending" || img.status === "error"
    );
    for (const img of pending) {
      await labelImage(img.id);
    }
    setIsLabeling(false);
  }, [apiKey, images, labelImage]);

  // Remove an image
  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (selectedImageId === id) setSelectedImageId(null);
    },
    [selectedImageId]
  );

  // Export single image label
  const exportLabel = useCallback(
    (image: LabeledImage) => {
      const yoloContent = toYOLOFormat(image.boxes);
      const labelFileName = image.fileName.replace(/\.[^.]+$/, ".txt");
      downloadFile(yoloContent, labelFileName);
    },
    []
  );

  // Export all labels
  const exportAllLabels = useCallback(() => {
    const labeled = images.filter(
      (img) => img.status === "done" && img.boxes.length > 0
    );
    if (labeled.length === 0) {
      alert("ไม่มีภาพที่ Label แล้วสำหรับ Export");
      return;
    }

    // Export classes.txt
    downloadFile(generateClassesTxt(classes), "classes.txt");

    // Export each label file
    labeled.forEach((img) => {
      const yoloContent = toYOLOFormat(img.boxes);
      const labelFileName = img.fileName.replace(/\.[^.]+$/, ".txt");
      downloadFile(yoloContent, labelFileName);
    });
  }, [images, classes]);

  const doneCount = images.filter((img) => img.status === "done").length;
  const pendingCount = images.filter(
    (img) => img.status === "pending" || img.status === "error"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          🏷️ Label Dataset ด้วย AI Vision
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ใช้ LLM Vision Model สร้าง Bounding Box Label สำหรับ Train YOLO
          อัตโนมัติ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* API Key & Model Config */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>⚙️</span> ตั้งค่า LLM
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    {showApiKey ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {SUPPORTED_MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำสั่งเพิ่มเติม (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="เช่น: ให้ตรวจจับเฉพาะวัตถุที่มีขนาดใหญ่กว่า 5% ของภาพ"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Class Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏷️</span> จัดการ Class
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addClass()}
                placeholder="ชื่อ class ใหม่..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={addClass}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                เพิ่ม
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: getBoxColor(cls.id) }}
                    />
                    <span className="text-sm font-medium">
                      {cls.id}: {cls.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeClass(cls.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {classes.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">
                  ยังไม่มี class — เพิ่ม class ที่ต้องการตรวจจับ
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📁</span> อัพโหลดรูปภาพ
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            >
              <p className="text-3xl mb-2">📸</p>
              <p className="text-sm font-medium text-gray-600">
                คลิกเพื่อเลือกรูปภาพ
              </p>
              <p className="text-xs text-gray-400 mt-1">
                รองรับ JPG, PNG, WebP (เลือกได้หลายไฟล์)
              </p>
            </button>

            {images.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  📊 ทั้งหมด {images.length} ภาพ | ✅ {doneCount} | ⏳{" "}
                  {pendingCount}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
              <button
                onClick={labelAllImages}
                disabled={isLabeling || pendingCount === 0}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLabeling
                  ? "🔄 กำลัง Label..."
                  : `🚀 Label ทั้งหมด (${pendingCount} ภาพ)`}
              </button>

              <button
                onClick={exportAllLabels}
                disabled={doneCount === 0}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                📥 Export YOLO Labels ({doneCount} ภาพ)
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Image Gallery & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Preview with Bounding Boxes */}
          {selectedImage && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  🔍 {selectedImage.fileName}
                </h2>
                <div className="flex gap-2">
                  {selectedImage.status === "done" && (
                    <button
                      onClick={() => exportLabel(selectedImage)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      📥 Export
                    </button>
                  )}
                  <button
                    onClick={() => labelImage(selectedImage.id)}
                    disabled={isLabeling}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                  >
                    🏷️ Label
                  </button>
                </div>
              </div>

              {/* Image with bounding box overlay */}
              <div className="relative inline-block w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.dataUrl}
                  alt={selectedImage.fileName}
                  className="w-full rounded-lg"
                />
                {/* SVG overlay for bounding boxes */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                >
                  {selectedImage.boxes.map((box, i) => {
                    const x = box.xCenter - box.width / 2;
                    const y = box.yCenter - box.height / 2;
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={box.width}
                          height={box.height}
                          fill="none"
                          stroke={getBoxColor(box.classId)}
                          strokeWidth="0.003"
                        />
                        <rect
                          x={x}
                          y={Math.max(0, y - 0.025)}
                          width={box.width}
                          height="0.025"
                          fill={getBoxColor(box.classId)}
                          opacity="0.8"
                        />
                        <text
                          x={x + 0.005}
                          y={Math.max(0.018, y - 0.006)}
                          fill="white"
                          fontSize="0.016"
                          fontWeight="bold"
                        >
                          {box.className} ({(box.confidence * 100).toFixed(0)}%)
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Detection Results */}
              {selectedImage.boxes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    ผลการตรวจจับ ({selectedImage.boxes.length} วัตถุ)
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {selectedImage.boxes.map((box, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-1.5"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{
                            backgroundColor: getBoxColor(box.classId),
                          }}
                        />
                        <span className="font-medium">{box.className}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">
                          Confidence: {(box.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YOLO Format Preview */}
              {selectedImage.boxes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    📄 YOLO Format
                  </h3>
                  <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                    {toYOLOFormat(selectedImage.boxes)}
                  </pre>
                </div>
              )}

              {selectedImage.error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">❌ {selectedImage.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🖼️</span> รูปภาพทั้งหมด
            </h2>

            {images.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📷</p>
                <p className="text-sm">ยังไม่มีรูปภาพ — อัพโหลดรูปภาพเพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImageId(img.id)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageId === img.id
                        ? "border-green-500 shadow-lg"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.dataUrl}
                      alt={img.fileName}
                      className="w-full aspect-square object-cover"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-1 left-1">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                          img.status === "done"
                            ? "bg-green-500 text-white"
                            : img.status === "labeling"
                              ? "bg-yellow-500 text-white"
                              : img.status === "error"
                                ? "bg-red-500 text-white"
                                : "bg-gray-500 text-white"
                        }`}
                      >
                        {img.status === "done"
                          ? `✅ ${img.boxes.length}`
                          : img.status === "labeling"
                            ? "⏳"
                            : img.status === "error"
                              ? "❌"
                              : "⏸️"}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-700 flex items-center justify-center"
                    >
                      ✕
                    </button>

                    {/* File name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-xs text-white truncate">
                        {img.fileName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to use guide */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📖</span> วิธีใช้งาน
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p>
                  <strong>1.</strong> ใส่ OpenAI API Key และเลือก Model
                </p>
                <p>
                  <strong>2.</strong> กำหนด Class ที่ต้องการตรวจจับ (เช่น rice,
                  corn, disease)
                </p>
                <p>
                  <strong>3.</strong> อัพโหลดรูปภาพที่ต้องการ Label
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>4.</strong> กด &quot;Label ทั้งหมด&quot; หรือ Label
                  ทีละภาพ
                </p>
                <p>
                  <strong>5.</strong> ตรวจสอบ Bounding Box บนภาพ
                </p>
                <p>
                  <strong>6.</strong> Export เป็น YOLO format (.txt + classes.txt)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
