import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./format-time";

describe("formatRelativeTime", () => {
  const now = new Date("2026-07-31T12:00:00Z").getTime();

  it("says just now for anything under a minute", () => {
    expect(formatRelativeTime(now - 30_000, "en", now)).toBe("Just now");
    expect(formatRelativeTime(now - 30_000, "fil", now)).toBe("Kanina lang");
  });

  it("handles singular vs plural minutes correctly in English", () => {
    expect(formatRelativeTime(now - 60_000, "en", now)).toBe("1 minute ago");
    expect(formatRelativeTime(now - 5 * 60_000, "en", now)).toBe("5 minutes ago");
  });

  it("formats hours", () => {
    expect(formatRelativeTime(now - 2 * 60 * 60_000, "en", now)).toBe("2 hours ago");
    expect(formatRelativeTime(now - 2 * 60 * 60_000, "fil", now)).toBe("2 oras ang nakalipas");
  });

  it("formats days under a week", () => {
    expect(formatRelativeTime(now - 3 * 24 * 60 * 60_000, "en", now)).toBe("3 days ago");
    expect(formatRelativeTime(now - 3 * 24 * 60 * 60_000, "fil", now)).toBe("3 araw ang nakalipas");
  });

  it("falls back to a calendar date after a week", () => {
    const eightDaysAgo = now - 8 * 24 * 60 * 60_000;
    const result = formatRelativeTime(eightDaysAgo, "en", now);
    expect(result).not.toContain("ago");
    expect(result).toMatch(/2026/);
  });

  it("never produces a negative duration for a future timestamp (clock skew safety)", () => {
    expect(formatRelativeTime(now + 10_000, "en", now)).toBe("Just now");
  });
});
