import type { AppLanguage } from "./settings";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Deliberately not using Intl.RelativeTimeFormat here — Filipino locale data
// support for it varies across browsers/engines, which is exactly the kind
// of silent inconsistency this app has hit before with browser-native APIs.
export function formatRelativeTime(timestamp: number, lang: AppLanguage, now: number = Date.now()): string {
  const diff = Math.max(0, now - timestamp);

  if (diff < MINUTE) return lang === "fil" ? "Kanina lang" : "Just now";

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return lang === "fil"
      ? `${minutes} minuto ang nakalipas`
      : `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return lang === "fil" ? `${hours} oras ang nakalipas` : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(diff / DAY);
  if (days < 7) {
    return lang === "fil" ? `${days} araw ang nakalipas` : `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(timestamp).toLocaleDateString(lang === "fil" ? "fil-PH" : "en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
