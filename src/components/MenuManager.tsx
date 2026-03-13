"use client";

import { useState } from "react";
import { useMenu } from "@/contexts/MenuContext";

const ICON_OPTIONS = [
  "📊", "🤖", "🌾", "🌱", "📈", "⚙️", "📋", "🏠",
  "📅", "💰", "🚜", "🌤️", "💧", "🐄", "🐔", "🌽",
];

export default function MenuManager() {
  const { menuItems, addMenuItem, removeMenuItem, resetToDefault } = useMenu();
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [newIcon, setNewIcon] = useState("📋");

  const handleAdd = () => {
    if (!newLabel.trim() || !newHref.trim()) return;

    const href = newHref.startsWith("/") ? newHref : `/${newHref}`;
    addMenuItem({ label: newLabel.trim(), href, icon: newIcon });
    setNewLabel("");
    setNewHref("");
    setNewIcon("📋");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setNewLabel("");
    setNewHref("");
    setNewIcon("📋");
    setIsAdding(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">จัดการเมนู</h3>
        <button
          onClick={resetToDefault}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          รีเซ็ต
        </button>
      </div>

      {/* Current menu items */}
      <ul className="space-y-1 mb-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className="text-sm text-gray-700 truncate">
                {item.label}
              </span>
            </div>
            {!item.isDefault && (
              <button
                onClick={() => removeMenuItem(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                aria-label={`ลบเมนู ${item.label}`}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Add form */}
      {isAdding ? (
        <div className="border border-green-200 rounded-lg p-3 bg-green-50 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              ไอคอน
            </label>
            <div className="flex flex-wrap gap-1">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-base transition-colors ${
                    newIcon === icon
                      ? "bg-green-600 ring-2 ring-green-400"
                      : "bg-white hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              ชื่อเมนู
            </label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="เช่น รายงาน"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              ลิงก์ (URL path)
            </label>
            <input
              type="text"
              value={newHref}
              onChange={(e) => setNewHref(e.target.value)}
              placeholder="เช่น /reports"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim() || !newHref.trim()}
              className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              เพิ่มเมนู
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm text-green-600 border border-dashed border-green-300 rounded-lg hover:bg-green-50 transition-colors"
        >
          <span>+</span> เพิ่มเมนู
        </button>
      )}
    </div>
  );
}
