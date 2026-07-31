import type { TranslationKey } from "./i18n";
import { isIOS, isAndroid } from "./platform";

export function cameraErrorKey(error: unknown): TranslationKey {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "cameraPermissionDenied";
      case "NotFoundError":
      case "OverconstrainedError":
        return "cameraNotFound";
      case "NotReadableError":
      case "TrackStartError":
        return "cameraInUse";
      default:
        return "cameraError";
    }
  }
  return "cameraError";
}

// SpeechRecognition's error codes are collapsed into one generic
// "didn't catch that" message by default, which hides genuinely different,
// often fixable problems (permission never granted, no network reaching the
// recognition service, no mic hardware) behind a message that suggests the
// user just needs to try again louder — when trying again won't help at all.
export function micErrorKey(errorCode: string): TranslationKey {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      if (isIOS()) return "micPermissionDeniedIOS";
      if (isAndroid()) return "micPermissionDeniedAndroid";
      return "micPermissionDenied";
    case "audio-capture":
      return "micNoMicrophone";
    case "network":
      return "micNetworkError";
    default:
      return "didNotUnderstand";
  }
}
