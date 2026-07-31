import { describe, expect, it } from "vitest";
import { computeObjectCoverCrop } from "./geometry";

describe("computeObjectCoverCrop", () => {
  const TARGET_ASPECT = 3 / 4;

  it("crops the sides on a wider-than-target source (iPhone landscape-reported 16:9 stream)", () => {
    const crop = computeObjectCoverCrop(1920, 1080, TARGET_ASPECT);
    expect(crop.sy).toBe(0);
    expect(crop.sHeight).toBe(1080);
    expect(crop.sWidth / crop.sHeight).toBeCloseTo(TARGET_ASPECT, 5);
    // Symmetric crop: equal margin on both sides.
    expect(crop.sx).toBeCloseTo((1920 - crop.sWidth) / 2, 5);
  });

  it("crops top/bottom on a taller-than-target source (portrait-native stream)", () => {
    const crop = computeObjectCoverCrop(1080, 1920, TARGET_ASPECT);
    expect(crop.sx).toBe(0);
    expect(crop.sWidth).toBe(1080);
    expect(crop.sWidth / crop.sHeight).toBeCloseTo(TARGET_ASPECT, 5);
  });

  it("matches an already-correct-aspect source exactly (no crop)", () => {
    const crop = computeObjectCoverCrop(300, 400, TARGET_ASPECT);
    expect(crop).toEqual({ sx: 0, sy: 0, sWidth: 300, sHeight: 400 });
  });

  it("produces a crop rectangle fully contained within the source for common camera ratios", () => {
    const cases: [number, number][] = [
      [1920, 1080], // iPhone-style landscape-reported stream
      [1280, 960], // 4:3 webcam
      [4032, 3024], // common phone photo resolution
    ];
    for (const [w, h] of cases) {
      const crop = computeObjectCoverCrop(w, h, TARGET_ASPECT);
      expect(crop.sx).toBeGreaterThanOrEqual(0);
      expect(crop.sy).toBeGreaterThanOrEqual(0);
      expect(crop.sx + crop.sWidth).toBeLessThanOrEqual(w + 0.001);
      expect(crop.sy + crop.sHeight).toBeLessThanOrEqual(h + 0.001);
    }
  });
});
