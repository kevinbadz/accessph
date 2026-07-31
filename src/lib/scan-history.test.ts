import { describe, expect, it } from "vitest";
import { addScanToHistory, clearScanHistory, loadScanHistory, removeScanFromHistory } from "./scan-history";

describe("scan history", () => {
  it("is empty by default", () => {
    expect(loadScanHistory()).toEqual([]);
  });

  it("adds an entry with a unique id and timestamp, newest first", () => {
    addScanToHistory({ text: "first", lowConfidence: false });
    addScanToHistory({ text: "second", lowConfidence: true });

    const history = loadScanHistory();
    expect(history).toHaveLength(2);
    expect(history[0].text).toBe("second");
    expect(history[1].text).toBe("first");
    expect(typeof history[0].timestamp).toBe("number");
    expect(history[0].id).not.toBe(history[1].id);
  });

  it("gives every entry a unique id even when added in the same millisecond", () => {
    // This is the scenario that broke a Date.now()-only identity scheme.
    const results = Array.from({ length: 10 }, (_, i) =>
      addScanToHistory({ text: `rapid ${i}`, lowConfidence: false })
    );
    const ids = results[results.length - 1].map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("caps history at 20 entries, dropping the oldest", () => {
    for (let i = 0; i < 25; i++) {
      addScanToHistory({ text: `scan ${i}`, lowConfidence: false });
    }
    const history = loadScanHistory();
    expect(history).toHaveLength(20);
    // Most recent (scan 24) should be first; the oldest 5 should be gone.
    expect(history[0].text).toBe("scan 24");
    expect(history.find((e) => e.text === "scan 0")).toBeUndefined();
  });

  it("removes a single entry by id, leaving others (including ones from the same millisecond) intact", () => {
    addScanToHistory({ text: "keep me", lowConfidence: false });
    const afterAdd = addScanToHistory({ text: "remove me", lowConfidence: false });
    const toRemove = afterAdd.find((e) => e.text === "remove me")!;

    const afterRemove = removeScanFromHistory(toRemove.id);
    expect(afterRemove.find((e) => e.text === "remove me")).toBeUndefined();
    expect(afterRemove.find((e) => e.text === "keep me")).toBeDefined();
  });

  it("clears all history", () => {
    addScanToHistory({ text: "something", lowConfidence: false });
    clearScanHistory();
    expect(loadScanHistory()).toEqual([]);
  });

  it("recovers gracefully from corrupted localStorage data", () => {
    window.localStorage.setItem("accessph:scan-history", "not valid json");
    expect(loadScanHistory()).toEqual([]);
  });
});
