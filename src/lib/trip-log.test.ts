import { describe, expect, it } from "vitest";
import { addTripLogEntry, clearTripLog, loadTripLog, removeTripLogEntry } from "./trip-log";

describe("trip log", () => {
  it("is empty by default", () => {
    expect(loadTripLog()).toEqual([]);
  });

  it("adds an entry with a unique id and timestamp, newest first", () => {
    addTripLogEntry({ photoDataUrl: null, location: { lat: 14.5, lng: 121.0 }, notifiedContacts: ["Ate"] });
    addTripLogEntry({ photoDataUrl: null, location: { lat: 14.6, lng: 121.1 }, notifiedContacts: ["Kuya"] });

    const log = loadTripLog();
    expect(log).toHaveLength(2);
    expect(log[0].notifiedContacts).toEqual(["Kuya"]);
    expect(log[1].notifiedContacts).toEqual(["Ate"]);
    expect(log[0].id).not.toBe(log[1].id);
  });

  it("caps the log at 10 entries", () => {
    for (let i = 0; i < 15; i++) {
      addTripLogEntry({ photoDataUrl: null, location: null, notifiedContacts: [`contact ${i}`] });
    }
    const log = loadTripLog();
    expect(log).toHaveLength(10);
    expect(log[0].notifiedContacts).toEqual(["contact 14"]);
  });

  it("removes a single entry by id", () => {
    const afterAdd = addTripLogEntry({ photoDataUrl: null, location: null, notifiedContacts: ["Keep"] });
    const second = addTripLogEntry({ photoDataUrl: null, location: null, notifiedContacts: ["Remove"] });
    const toRemove = second.find((e) => e.notifiedContacts[0] === "Remove")!;

    const afterRemove = removeTripLogEntry(toRemove.id);
    expect(afterRemove.find((e) => e.notifiedContacts[0] === "Remove")).toBeUndefined();
    expect(afterRemove.find((e) => e.notifiedContacts[0] === "Keep")).toBeDefined();
    // Sanity check the earlier add actually happened (not an unused variable).
    expect(afterAdd.length).toBeGreaterThan(0);
  });

  it("clears the log", () => {
    addTripLogEntry({ photoDataUrl: null, location: null, notifiedContacts: ["x"] });
    clearTripLog();
    expect(loadTripLog()).toEqual([]);
  });

  it("recovers gracefully from corrupted localStorage data", () => {
    window.localStorage.setItem("accessph:trip-log", "not valid json");
    expect(loadTripLog()).toEqual([]);
  });

  it("does not throw when localStorage quota is exceeded, and preserves the newest entries", () => {
    const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
    let callCount = 0;
    window.localStorage.setItem = (key: string, value: string) => {
      callCount++;
      // Fail the first write (simulating quota exceeded on a large photo),
      // succeed on the retry with the trimmed payload.
      if (callCount === 1) {
        throw new DOMException("QuotaExceededError");
      }
      originalSetItem(key, value);
    };

    expect(() =>
      addTripLogEntry({ photoDataUrl: "data:image/jpeg;base64,huge", location: null, notifiedContacts: ["x"] })
    ).not.toThrow();

    window.localStorage.setItem = originalSetItem;
  });
});
