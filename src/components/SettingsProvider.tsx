"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings } from "@/lib/settings";

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Start from the same defaults the server rendered — reading localStorage here
  // (even in a lazy initializer) runs during the client's hydration render too,
  // which would mismatch the server output whenever a setting differs from default.
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Sync from localStorage (external system) after mount, once hydration is done.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loadSettings());
  }, []);

  function updateSettings(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
