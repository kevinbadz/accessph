export type AppLanguage = "en" | "fil";

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface AppSettings {
  language: AppLanguage;
  emergencyContact: EmergencyContact | null;
  speechRate: number;
}

const STORAGE_KEY = "accessph:settings";

export const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  emergencyContact: null,
  speechRate: 1,
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
