"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/contexts/MenuContext";
import MenuManager from "@/components/MenuManager";

export default function Navbar() {
  const pathname = usePathname();
  const { menuItems } = useMenu();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings panel on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setMobileMenuOpen(false);
      }
    }
    if (settingsOpen || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [settingsOpen, mobileMenuOpen]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setSettingsOpen(false);
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={closeMenus}
          >
            <span className="text-2xl">🌾</span>
            <h1 className="text-xl font-bold">KhonKhong Farm</h1>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-green-900 text-white"
                    : "text-green-100 hover:bg-green-700"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Settings button */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen((prev) => !prev)}
                className={`ml-2 p-2 rounded-md transition-colors ${
                  settingsOpen
                    ? "bg-green-900 text-white"
                    : "text-green-200 hover:bg-green-700"
                }`}
                aria-label="จัดการเมนู"
                title="จัดการเมนู"
              >
                ⚙️
              </button>

              {/* Settings dropdown */}
              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 text-gray-900 overflow-hidden">
                  <MenuManager />
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => {
                setSettingsOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-md text-green-200 hover:bg-green-700 transition-colors"
              aria-label="จัดการเมนู"
            >
              ⚙️
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setSettingsOpen(false);
              }}
              className="p-2 rounded-md text-green-200 hover:bg-green-700 transition-colors"
              aria-label="เปิดเมนู"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-green-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMenus}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-green-900 text-white"
                    : "text-green-100 hover:bg-green-700"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile settings panel */}
      {settingsOpen && (
        <div className="sm:hidden border-t border-green-700 bg-white text-gray-900">
          <MenuManager />
        </div>
      )}
    </nav>
  );
}
