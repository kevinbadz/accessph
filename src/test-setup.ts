import { beforeEach } from "vitest";

// jsdom's window.localStorage can resolve to `undefined` under Node's own
// experimental native Web Storage implementation (Node 22+, gated behind a
// --localstorage-file flag) — a version-specific interop quirk, not
// something a test suite should depend on. A small in-memory polyfill is
// self-contained and portable across Node/jsdom versions.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

Object.defineProperty(window, "localStorage", {
  value: new MemoryStorage(),
  writable: true,
  configurable: true,
});

beforeEach(() => {
  window.localStorage.clear();
});
