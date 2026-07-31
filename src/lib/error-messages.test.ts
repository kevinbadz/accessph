import { afterEach, describe, expect, it, vi } from "vitest";
import { cameraErrorKey, micErrorKey } from "./error-messages";

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

describe("cameraErrorKey", () => {
  it("maps NotAllowedError to the permission-denied message", () => {
    expect(cameraErrorKey(new DOMException("denied", "NotAllowedError"))).toBe("cameraPermissionDenied");
  });

  it("maps NotFoundError and OverconstrainedError to the no-camera-found message", () => {
    expect(cameraErrorKey(new DOMException("", "NotFoundError"))).toBe("cameraNotFound");
    expect(cameraErrorKey(new DOMException("", "OverconstrainedError"))).toBe("cameraNotFound");
  });

  it("maps NotReadableError to the camera-in-use message", () => {
    expect(cameraErrorKey(new DOMException("", "NotReadableError"))).toBe("cameraInUse");
  });

  it("falls back to the generic message for unrecognized errors, including non-DOMException values", () => {
    expect(cameraErrorKey(new DOMException("", "SomeOtherError"))).toBe("cameraError");
    expect(cameraErrorKey(new Error("plain error"))).toBe("cameraError");
    expect(cameraErrorKey("a string, not an error object")).toBe("cameraError");
    expect(cameraErrorKey(undefined)).toBe("cameraError");
  });
});

describe("micErrorKey", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gives iOS-specific instructions for permission errors on iPhone", () => {
    vi.stubGlobal("navigator", { ...navigator, userAgent: IPHONE_UA });
    expect(micErrorKey("not-allowed")).toBe("micPermissionDeniedIOS");
    expect(micErrorKey("service-not-allowed")).toBe("micPermissionDeniedIOS");
  });

  it("gives Android-specific instructions for permission errors on Android", () => {
    vi.stubGlobal("navigator", { ...navigator, userAgent: ANDROID_UA });
    expect(micErrorKey("not-allowed")).toBe("micPermissionDeniedAndroid");
  });

  it("gives the generic permission message on other platforms", () => {
    vi.stubGlobal("navigator", { ...navigator, userAgent: "some-other-browser" });
    expect(micErrorKey("not-allowed")).toBe("micPermissionDenied");
  });

  it("maps hardware and network error codes correctly, independent of platform", () => {
    expect(micErrorKey("audio-capture")).toBe("micNoMicrophone");
    expect(micErrorKey("network")).toBe("micNetworkError");
  });

  it("falls back to the generic didn't-understand message for anything else (e.g. no-speech)", () => {
    expect(micErrorKey("no-speech")).toBe("didNotUnderstand");
    expect(micErrorKey("aborted")).toBe("didNotUnderstand");
  });
});
