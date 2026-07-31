import { afterEach, describe, expect, it, vi } from "vitest";
import { isAndroid, isIOS } from "./platform";

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
const DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

function setUserAgent(ua: string) {
  vi.stubGlobal("navigator", { ...navigator, userAgent: ua });
}

describe("platform detection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("detects iPhone", () => {
    setUserAgent(IPHONE_UA);
    expect(isIOS()).toBe(true);
    expect(isAndroid()).toBe(false);
  });

  it("detects Android", () => {
    setUserAgent(ANDROID_UA);
    expect(isAndroid()).toBe(true);
    expect(isIOS()).toBe(false);
  });

  it("detects neither on desktop", () => {
    setUserAgent(DESKTOP_UA);
    expect(isIOS()).toBe(false);
    expect(isAndroid()).toBe(false);
  });
});
