import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings } from "./settings";

describe("settings persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns defaults when nothing has been saved yet", () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("round-trips a saved settings object with multiple emergency contacts", () => {
    const settings: AppSettings = {
      language: "fil",
      emergencyContacts: [
        { name: "Juan Dela Cruz", phone: "+639171234567" },
        { name: "Maria Santos", phone: "+639181234567" },
      ],
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

  it("migrates a legacy single emergencyContact field into the emergencyContacts array", () => {
    window.localStorage.setItem(
      "accessph:settings",
      JSON.stringify({
        language: "en",
        speechRate: 1,
        emergencyContact: { name: "Old Format Contact", phone: "+639001234567" },
      })
    );

    const loaded = loadSettings();
    expect(loaded.emergencyContacts).toEqual([{ name: "Old Format Contact", phone: "+639001234567" }]);
    expect(loaded).not.toHaveProperty("emergencyContact");
  });

  it("migrates a legacy null emergencyContact into an empty array", () => {
    window.localStorage.setItem(
      "accessph:settings",
      JSON.stringify({ language: "en", speechRate: 1, emergencyContact: null })
    );

    expect(loadSettings().emergencyContacts).toEqual([]);
  });

  it("prefers the new emergencyContacts array if both old and new fields are somehow present", () => {
    window.localStorage.setItem(
      "accessph:settings",
      JSON.stringify({
        language: "en",
        speechRate: 1,
        emergencyContact: { name: "Legacy", phone: "+639000000000" },
        emergencyContacts: [{ name: "Current", phone: "+639111111111" }],
      })
    );

    expect(loadSettings().emergencyContacts).toEqual([{ name: "Current", phone: "+639111111111" }]);
  });
});
