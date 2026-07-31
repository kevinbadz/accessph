import { describe, expect, it } from "vitest";
import { BENEFIT_CATEGORIES } from "./benefits";

describe("BENEFIT_CATEGORIES", () => {
  it("has at least one category", () => {
    expect(BENEFIT_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = BENEFIT_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has both English and Filipino text filled in for every field of every category", () => {
    for (const category of BENEFIT_CATEGORIES) {
      for (const lang of ["en", "fil"] as const) {
        expect(category.title[lang]?.trim(), `${category.id}.title.${lang}`).toBeTruthy();
        expect(category.summary[lang]?.trim(), `${category.id}.summary.${lang}`).toBeTruthy();
        expect(category.whereToGo[lang]?.trim(), `${category.id}.whereToGo.${lang}`).toBeTruthy();
        expect(category.points[lang]?.length, `${category.id}.points.${lang}`).toBeGreaterThan(0);
        for (const point of category.points[lang]) {
          expect(point.trim(), `${category.id}.points.${lang} contains an empty entry`).toBeTruthy();
        }
      }
      // English and Filipino point lists should cover the same information —
      // a mismatched count is a strong signal one language was edited and
      // the other wasn't.
      expect(category.points.fil.length, `${category.id} point count mismatch`).toBe(
        category.points.en.length
      );
    }
  });

  it("has a non-empty icon for every category", () => {
    for (const category of BENEFIT_CATEGORIES) {
      expect(category.icon.trim(), category.id).toBeTruthy();
    }
  });
});
