export type AppLanguage = "en" | "fil";

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface AppSettings {
  language: AppLanguage;
  emergencyContacts: EmergencyContact[];
  speechRate: number;
}

const STORAGE_KEY = "accessph:settings";

export const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  emergencyContacts: [],
  speechRate: 1,
};

// Older saved data used a single `emergencyContact` field instead of the
// `emergencyContacts` array. Migrate it forward rather than silently
// dropping someone's already-configured emergency contact. Must check the
// raw parsed input for the array field, not the post-default-merge object —
// DEFAULT_SETTINGS.emergencyContacts is itself an array, so checking the
// merged object can never detect "the input didn't have this field".
function migrateLegacyContact(
  parsed: Record<string, unknown> & { emergencyContact?: EmergencyContact | null }
): AppSettings {
  const merged = { ...DEFAULT_SETTINGS, ...parsed } as AppSettings & {
    emergencyContact?: EmergencyContact | null;
  };

  if (!Array.isArray(parsed.emergencyContacts) && parsed.emergencyContact) {
    merged.emergencyContacts = [parsed.emergencyContact];
  }

  delete merged.emergencyContact;
  return merged;
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return migrateLegacyContact(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
