import { describe, expect, it } from "vitest";
import { stretchContrast } from "./image-preprocess";

// Builds a flat RGBA buffer for `count` pixels, each with the given gray value.
function makePixels(values: number[]): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(values.length * 4);
  values.forEach((v, i) => {
    pixels[i * 4] = v;
    pixels[i * 4 + 1] = v;
    pixels[i * 4 + 2] = v;
    pixels[i * 4 + 3] = 255;
  });
  return pixels;
}

describe("stretchContrast", () => {
  it("stretches a low-contrast image (background 100, text 180) to full range", () => {
    // 100 background pixels, 10 "text" pixels — matches the real proportions
    // of a photo where text is a minority of the frame.
    const values = [...Array(100).fill(100), ...Array(10).fill(180)];
    const pixels = makePixels(values);
    stretchContrast(pixels, values.length);

    // Background should stretch toward black, text toward white.
    expect(pixels[0]).toBeLessThan(30);
    expect(pixels[100 * 4]).toBeGreaterThan(225);
  });

  it("is not skewed by a single stray outlier pixel (glare/shadow)", () => {
    // This is the scenario the percentile-clip fix was written for: without
    // it, one pixel at 255 would compress the real 100-180 range into a
    // narrow, low-contrast band instead of stretching it fully.
    const values = [...Array(100).fill(100), ...Array(10).fill(180), 255];
    const pixels = makePixels(values);
    stretchContrast(pixels, values.length);

    const backgroundAfter = pixels[0];
    const textAfter = pixels[100 * 4];
    expect(backgroundAfter).toBeLessThan(30);
    expect(textAfter).toBeGreaterThan(225);
    // The outlier itself still gets clamped into range, just doesn't ruin
    // the stretch for everything else.
    expect(pixels[110 * 4]).toBeLessThanOrEqual(255);
  });

  it("does not crash on a uniform image (zero contrast range)", () => {
    const values = Array(50).fill(128);
    const pixels = makePixels(values);
    expect(() => stretchContrast(pixels, values.length)).not.toThrow();
    // No usable range to stretch — every pixel should end up identical.
    expect(pixels[0]).toBe(pixels[4]);
  });

  it("converts color pixels to grayscale (R=G=B after processing)", () => {
    const pixels = new Uint8ClampedArray([200, 50, 10, 255, 10, 50, 200, 255]);
    stretchContrast(pixels, 2);
    expect(pixels[0]).toBe(pixels[1]);
    expect(pixels[1]).toBe(pixels[2]);
    expect(pixels[4]).toBe(pixels[5]);
    expect(pixels[5]).toBe(pixels[6]);
  });
});
