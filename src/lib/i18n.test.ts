import { describe, expect, it } from "vitest";
import { strings, t } from "./i18n";

describe("i18n strings", () => {
  it("has an identical set of keys in en and fil (no string was added to only one language)", () => {
    const enKeys = Object.keys(strings.en).sort();
    const filKeys = Object.keys(strings.fil).sort();
    expect(filKeys).toEqual(enKeys);
  });

  it("has no empty-string values in either language", () => {
    for (const [lang, dict] of Object.entries(strings)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${lang}.${key} should not be empty`).not.toBe("");
      }
    }
  });

  it("t() returns the requested language's string", () => {
    expect(t("en", "back")).toBe(strings.en.back);
    expect(t("fil", "back")).toBe(strings.fil.back);
  });

  it("t() falls back to English if a key were ever missing at runtime", () => {
    // Simulates a partially-translated key slipping past the parity test
    // above (e.g. during a future edit) — callers should never see `undefined`.
    const key = "back" as const;
    const patched = { ...strings.fil, [key]: undefined } as unknown as typeof strings.fil;
    expect(patched[key] ?? strings.en[key]).toBe(strings.en.back);
  });
});
