export interface ScanHistoryEntry {
  id: string;
  text: string;
  timestamp: number;
  lowConfidence: boolean;
}

const STORAGE_KEY = "accessph:scan-history";
const MAX_ENTRIES = 20;

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback for environments without crypto.randomUUID — timestamp alone
  // isn't a safe unique id since two scans can land in the same millisecond.
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadScanHistory(): ScanHistoryEntry[] {
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

// Newest entry first. Silently drops entries beyond MAX_ENTRIES rather than
// growing localStorage without bound — this is a convenience for re-hearing
// a recent scan, not a permanent record someone needs to keep forever.
export function addScanToHistory(entry: Omit<ScanHistoryEntry, "id" | "timestamp">): ScanHistoryEntry[] {
  const next = [{ ...entry, id: generateId(), timestamp: Date.now() }, ...loadScanHistory()].slice(
    0,
    MAX_ENTRIES
  );
  saveScanHistory(next);
  return next;
}

export function removeScanFromHistory(id: string): ScanHistoryEntry[] {
  const next = loadScanHistory().filter((entry) => entry.id !== id);
  saveScanHistory(next);
  return next;
}

export function clearScanHistory(): void {
  saveScanHistory([]);
}

function saveScanHistory(entries: ScanHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
