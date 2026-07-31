import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings } from "./settings";

describe("settings persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns defaults when nothing has been saved yet", () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("round-trips a saved settings object", () => {
    const settings: AppSettings = {
      language: "fil",
      emergencyContact: { name: "Juan Dela Cruz", phone: "+639171234567" },
      speechRate: 1.2,
    };
    saveSettings(settings);
    expect(loadSettings()).toEqual(settings);
  });

  it("falls back to defaults if localStorage holds corrupted JSON", () => {
    window.localStorage.setItem("accessph:settings", "{not valid json");
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("fills in missing fields with defaults (forward-compatible with older saved data)", () => {
    window.localStorage.setItem("accessph:settings", JSON.stringify({ language: "fil" }));
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, language: "fil" });
  });
});
