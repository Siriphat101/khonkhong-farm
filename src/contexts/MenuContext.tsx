"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { MenuItem } from "@/types";

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", href: "/", label: "แดชบอร์ด", icon: "📊", isDefault: true },
  { id: "assistant", href: "/assistant", label: "AI ผู้ช่วยฟาร์ม", icon: "🤖", isDefault: true },
];

const STORAGE_KEY = "khonkhong-farm-menu-items";

interface MenuContextValue {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  removeMenuItem: (id: string) => void;
  resetToDefault: () => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

function loadMenuItems(): MenuItem[] {
  if (typeof window === "undefined") return DEFAULT_MENU_ITEMS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as MenuItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_MENU_ITEMS;
}

function saveMenuItems(items: MenuItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadMenuItems());

  useEffect(() => {
    saveMenuItems(menuItems);
  }, [menuItems]);

  const addMenuItem = useCallback((item: Omit<MenuItem, "id">) => {
    const id = `custom-${Date.now()}`;
    setMenuItems((prev) => [...prev, { ...item, id, isDefault: false }]);
  }, []);

  const removeMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetToDefault = useCallback(() => {
    setMenuItems(DEFAULT_MENU_ITEMS);
  }, []);

  return (
    <MenuContext.Provider
      value={{ menuItems, addMenuItem, removeMenuItem, resetToDefault }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
