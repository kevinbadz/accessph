export interface TripLogEntry {
  id: string;
  timestamp: number;
  photoDataUrl: string | null;
  location: { lat: number; lng: number } | null;
  notifiedContacts: string[];
}

const STORAGE_KEY = "accessph:trip-log";
// Photos are stored as data URLs in localStorage, which has a real size
// ceiling (~5-10MB depending on browser) — keep this low so a handful of
// trips doesn't silently fail to save.
const MAX_ENTRIES = 10;

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadTripLog(): TripLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addTripLogEntry(entry: Omit<TripLogEntry, "id" | "timestamp">): TripLogEntry[] {
  const next = [{ ...entry, id: generateId(), timestamp: Date.now() }, ...loadTripLog()].slice(
    0,
    MAX_ENTRIES
  );
  saveTripLog(next);
  return next;
}

export function removeTripLogEntry(id: string): TripLogEntry[] {
  const next = loadTripLog().filter((entry) => entry.id !== id);
  saveTripLog(next);
  return next;
}

export function clearTripLog(): void {
  saveTripLog([]);
}

function saveTripLog(entries: TripLogEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded (large photos) — drop the oldest half and retry once
    // rather than losing the newest trip, which is the one that matters most.
    const trimmed = entries.slice(0, Math.ceil(entries.length / 2));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Still failing — give up silently rather than throw during a safety flow.
    }
  }
}
